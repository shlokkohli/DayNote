import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {

    const session = await getServerSession(authOptions)

    try {

        if(!session){
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 400 }
            )
        }

        const { NotificationType, SummaryFormat } = await request.json();

        // update the user's notification preference and summary preference
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                NotificationType: NotificationType,
                SummaryFormat: SummaryFormat  
            }
        })

        return NextResponse.json(
            { message: "Preferences updated successfully" },
            { status: 200 }
        )
        
    } catch (error) {

        return NextResponse.json(
            { message: "Error updating settings" },
            { status: 500 }
        )
        
    }

}