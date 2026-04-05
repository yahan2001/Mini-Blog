import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => 
            console.log("Database connected")
        );
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}