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
                { message: "No logs for today" },
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

        const output = summary.candidates?.[0].content?.parts?.[0].text as string

        // take this output and save it to the database
        const response = await prisma.summary.create({
            data: {
                content: output,
                ownerId: session.user.id,
            }
        })

        return NextResponse.json(
            { summary: response.content },
            { status: 200 }
        )
        
    } catch (error) {

        console.log(error)

        return NextResponse.json(
            { message: "Error occured while generating summary", error },
            { status: 500 }
        )
        
    }

}