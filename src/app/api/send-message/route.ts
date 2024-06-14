import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";


export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
            {status: 404}
        )
        }

        if (!user.isAcceptMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            },
            {status: 404}
        )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: false,
            message: "message sent successfully"
        },
        {status: 200}
    )
    } catch (error) {
        console.log("Error adding messages ", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        },
        {status: 500}
    )
    }
}