import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DataBase connected successfully");
    } catch (error) {
        console.log("Error in connecting to database: ", error.message);
    }
}

export default connectDB;