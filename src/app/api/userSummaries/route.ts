import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

    // this route will go to the user's summary and fetch all its summaries

    // first check if the user is authenticated
    const session = await getServerSession(authOptions);
    if(!session?.user.id){
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        )
    }

    try {

        // fetch the current user's all the summaries
        const summaries = await prisma.summary.findMany({
            where: {
                ownerId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                content: true,
                createdAt: true,
                id: true
            }
        });

        return NextResponse.json(
            { summaries },
            { status: 200 }
        )
        
    } catch (error) {

        return NextResponse.json(
            { message: "Failed to fetch summaries" },
            { status: 500 }
        )
        
    }

}