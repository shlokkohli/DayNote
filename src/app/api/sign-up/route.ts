import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request : Request) {

    try {

        const {name, email, password} = await request.json();

        // check if email, name or password are missing
        if(!name || !email || !password){
            return NextResponse.json(
                { message: 'Missing fields' },
                { status: 400 }
            )
        }

        // check if the user exists in the database
        const checkExistingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(checkExistingUser){
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 409 }
            )
        }

        // first hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // if the user does not exist, create new user in the database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password : hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        return NextResponse.json(
            { message: 'User created successfully', user },
            { status: 200 }
        )
        
    } catch (error) {

        return NextResponse.json(
            { message: 'Error occured creating user', error },
            { status: 500 }
        )

    }

}