import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

// in this page, the user will visit the log page and log their current mood
export async function POST(request: Request){

    const session = await getServerSession(authOptions);

    if(!session || !session.user.id){
        return NextResponse.json(
            { message: "Unauthorized" },
            {status: 401 }
        )
    }

    try {

        const { logEntry } = await request.json();

        if(!logEntry){
            return NextResponse.json(
                { message : "logEntry cannot be empty" },
                { status: 400 }
            )
        }

        // save the log with time
        const log = await prisma.log.create({
            data: {
                content: logEntry,
                ownerId: session.user.id
            }
        })

        console.log(log.createdAt.toLocaleString())

        return NextResponse.json(
            { message: "Log saved", log },
            { status: 200 }
        )
        
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { message: "Error saving log", error },
            { status: 500 }
        )
        
    }

}