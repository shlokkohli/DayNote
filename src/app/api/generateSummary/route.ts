import { ai } from "@/lib/gemini";
import { systemInstruction } from "@/lib/promptSumarize";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request){

    const session = await getServerSession(authOptions);
    if(!session?.user.id){
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        )
    }

    try {

        // first get today's date
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0)) // this sets time to the start of the day 0:0:0
        const endOfDay = new Date(now.setHours(23, 59, 59)) // this sets the time to the end of the day 23:59:59

        // check if a summary already exists for that day
        const existingSummary = await prisma.summary.findFirst({
            where: {
                ownerId: session.user.id,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            select: {
                content: true
            }
        })
        
        // // if summary already exists, return that summary only
        if(existingSummary){
            return NextResponse.json(
                { message: existingSummary },
                { status: 200 }
            )
        }

        // if the summary does not exist, create one by taking a user's all the logs

        //  Step 1: Fetch a user's logs for today
        const logs = await prisma.log.findMany({
            where: {
                ownerId: session.user.id,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        // if there are no logs, send an error
        if(logs.length === 0){
            return NextResponse.json(
                { message: "No logs for toady" },
                { status: 404 }
            )
        }


        // format the logs this mannar -> [time] [contnet]
        const formattedLogs = logs.map((eachLog) => {
            const time = eachLog.createdAt.toLocaleString().split(',')[1].trim()
            return `${time} ${eachLog.content}`
        }).join('\n')

        // Get the user's preferred summary format
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            }
        })

        const SummaryFormat = user?.SummaryFormat

        const prompt = `User's journal entries: ${formattedLogs}
        Generate a summary of the user's day in the ${SummaryFormat} format`

        // generate the user's summary
        const summary = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction
            }
        })

        const output = summary.candidates?.[0].content?.parts?.[0] as string


        // generate the user's isProductive title
        const response2 = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: output,
            config: {
                systemInstruction: "You are going to get a user's day summary data an input and you are supposed to label it as productive or non productive. You are not supposed to be polite nor harsh, just be honest and tell the user if the day was productive or not, and make sure to strictly adhere to just true or false. If the day was productive, give a yes, otherwise no. Make sure to write yes or no in all small letters."
            }
        })

        const productivityResponse = response2.candidates?.[0].content?.parts?.[0] as string

        const isProductive = productivityResponse === "yes";

        // take this output and save it to the database
        await prisma.summary.create({
            data: {
                content: output,
                ownerId: session.user.id,
                isProductive: isProductive,
            }
        })

        // once the summary is saved, delete all logs
        await prisma.log.deleteMany({
            where: {
                ownerId: session.user.id,
            }
        })

        return NextResponse.json(
            { message: "Summary generated" },
            { status: 200 }
        )
        
    } catch (error) {

        return NextResponse.json(
            { message: "Error occured while generating summary", error },
            { status: 500 }
        )
        
    }

}