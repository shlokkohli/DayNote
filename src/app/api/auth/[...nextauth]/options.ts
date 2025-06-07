import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Email & Password',
            credentials: {
                email: { label: "Email", type: 'email' },
                password: { label: "Password", type: "Password" }
            },
            async authorize(credentials: any): Promise<any> {
                // write user login logic here

                try {

                    // first get the email and password from the user
                    const {email, password} = credentials;

                    // check if the user exists
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        },
                    })

                    if(!user){
                        throw new Error("User not found with this email")
                    }

                    if(!user.password){
                        throw new Error("This email was used to sign up with Google. Please sign in with Google.")
                    }

                    // compare the password, (credentials password with user password)
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(!isPasswordCorrect){
                        throw new Error("Incorrect password");
                    }

                    return user;

                } catch (error: any) {

                    throw new Error("Login failed", error)
                    
                }

            }
        }),
    ],
    callbacks: {
        async jwt ({ user, token }){
            if(user){
                token.name = user.name,
                token.id = user.id
            }

            return token;
        },

        async session ({session, token}){
            if(token){
                session.user.name = token.name,
                session.user.id = token.id
            }
            return session;
        },

        async signIn({ account, profile }) {

            try {

                if(account?.provider === 'google'){
                    // check if the user exist in the database
                    const existingUser = await prisma.user.findUnique({
                        where: {
                            email: profile?.email
                        }
                    })

                    // if does not exist create  manually
                    if(!existingUser){
                        const user = await prisma.user.create({
                            data: {
                                id: profile?.sub,
                                email: profile?.email as string,
                                name: profile?.name as string
                            }
                        })
                    }
                }

                return true;
                
            } catch (error) {

                console.error("Error in signIn callback:", error)
                return false
                
            }
        }
    },
    pages: {
        signIn: '/sign-up'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
}