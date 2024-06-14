import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth"

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json(
                {
                    success:false,
                    message: "Not Authenticated"
                },
                {
                    status  : 401
                }
            )
    }

    const userId = user._id
    const {accpetMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptMessage: accpetMessages},
            {new : true}
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success:false,
                    message: "failed to update user status to accept messaeges"
                },
                {
                    status  : 400
                }
            ) 
        } 

        return Response.json(
            {
                success:true,
                message: "Message updatace status updated successfully",
                updatedUser
            },
            {
                status  : 200
            }
        )
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success:false,
                message: "User not found"
            },
            {
                status  : 500
            }
        )
    }
     
}

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json(
                {
                    success:false,
                    message: "Not Authenticated"
                },
                {
                    status  : 401
                }
            )
    }

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
    
        if (!foundUser) {
            return Response.json(
                {
                    success:false,
                    message: "failed to find the user "
                },
                {
                    status  : 404
                }
            ) 
        }
        
        return Response.json(
            {
                success:true,
                isAcceptMessage: foundUser.isAcceptMessage
                
            },
            {
                status  : 400
            }
        ) 
    
    }
    catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success:false,
                message: "User not found"
            },
            {
                status  : 500
            }
        )
    }}