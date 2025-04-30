import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

    const session = await getServerSession(authOptions)

    try {

        if(!session){
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                NotificationType: true,
                SummaryFormat: true
            }
        })

        if(!user){
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: user },
            { status: 200 }
        )        
        
    } catch (error) {

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
        
    }

}
