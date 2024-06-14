import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username   : credentials.identifier},
                        ]
                    })

                    if (!user){
                        throw new Error("User not found");
                    }

                    if (!user.isVerified) {
                        throw new Error("User is not verified");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user;
                    } else{
                        throw new Error("Invalid password");
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
          },
        async jwt({ token, user}) {
            if (user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages= user.isAcceptingMessages
                token.username = user.username
            }
            return token
    }
},
    pages:{
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

    
}