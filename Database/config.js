import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoDB_URl = process.env.MONGODB_URL;

const connectDB = async (req, res) => {
  try {
   
    const connection = await mongoose.connect(mongoDB_URl);
    console.log("MongoDB Connected SUCCESSFULLY");
    return connection;
  } catch (error) {
    console.log(error);

res.status(500).json({ messege: "Error connecting to MongoDB" });
  }
};

export default connectDB;
