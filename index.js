import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/config.js";
import userRoute from "./Routes/userRoute.js";
import productRoute from "./Routes/productsRoute.js"

dotenv.config();


const port = process.env.PORT 
const app = express();
//const port = 4000
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);


//Routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the app!");
});

app.listen(port, () => {
    
    
  console.log(`App is running on port`);
});
