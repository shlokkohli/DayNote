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
        const startOfDay = new Date(now)
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        
        //  Step 1: Fetch the user's logs for today
        const logs = await prisma.log.findMany({
            where: {
                ownerId: session.user.id,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // if there are no logs, send an error
        if(logs.length === 0){
            return NextResponse.json(
                { message: "You did not logged your day today!" },
                { status: 404 }
            )
        }


        // format the logs this manner -> [time] [content]
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

        // take this output and save to the database

        // # Check if there is already a summary for today
        const existingSummary = await prisma.summary.findFirst({
            where: {
                ownerId: session.user.id,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        })

        let savedSummary;

        // (if yes, replace it with the new one)
        if(existingSummary){
            savedSummary = await prisma.summary.update({
                where: {
                    id: existingSummary.id,
                },
                data: {
                    content: output
                }
            })
        } else {
            // save the summary to the database
            savedSummary = await prisma.summary.create({
                data: {
                    content: output,
                    ownerId: session.user.id,
                }
            })
        }

        return NextResponse.json(
            { summary: savedSummary.content },
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