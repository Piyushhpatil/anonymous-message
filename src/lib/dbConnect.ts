import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected){
        console.log("already connected to database");
        return
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {})

        connection.isConnected = db.connections[0].readyState

        console.log(" DB is Connected Successfully")        
    } catch (error) {
        console.log("Database Connection failed", error)
        process.exit(1)
    }
}

export default dbConnect;