import User from "../Models/userSchema.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { text } from "express";

dotenv.config();
export const createUser = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, name, email, password: hashPassword });

    await newUser.save();
    res
      .status(200)
      .json({ messege: "Usrer Register Successfully", data: [newUser] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messege: "Server Error in creating user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userDetail = await User.findOne({ email });

    if (!userDetail) {
      return res.status(400).json({ messege: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, userDetail.password);
    if (!passwordMatch) {
      return res.status(401).json({ messege: "Invalid Password" });
    }
    // jwt pat token after creating
    const token = jwt.sign(
      { _id: userDetail._id },
      process.env.JWT_Secret_Key,
      { expiresIn: "1h" }
    );
    userDetail.token = token;
    await userDetail.save();

    res
      .status(200)
      .json({ messege: "Usrer Logedin Successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messege: "Server Error in login user" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    res
      .status(200)
      .json({ message: "data fetched successfully", data: [user] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error in getall method" });
  }
};

export const getId = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    res
      .status(200)
      .json({ message: "data fetched successfully", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error in getall method" });
  }
};

export const deleteUser = async(req,res)=>{
  try {
    const userId = req.params.id
    const deleteProduct= await User.deleteOne({_id:userId})
    
    res.status(200).json({ messege: "Account  Deleted Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error in Delete User");
  }
}


export const forgotPassword = async (req, res) => {

  const {email} = req.body
  const user = await User.findOne({email})
  console.log(user.email);
  
  if(!user){
    return res.status(404).json({message:"User Not Found"})
  }
  const token = jwt.sign({_id:user._id},process.env.JWT_Secret_Key,{expiresIn:"1d"})
  let transporter =  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.PASSMAIL,
      pass: process.env.PASSKEY
    },
    tls: {
      rejectUnauthorized: false
    }
  })
let mailOptions ={
  from : process.env.PASSMAIL,
  to:user.email,
  subject:"Password Reset",
  text:"To reset your password, please click on the following link:\n\n"+`https://mernhavenland.netlify.app/reset-password/${user._id}/${token}`

}

transporter.sendMail(mailOptions,(error,info)=>{
  if(error){
    console.log(error)
    return res.status(500).json({message:"Failed to send email"})
  }else{
    return res.status(200).json({message:"Email sent successfully"})
  }
}
)
}

export const resetPassword = async (req,res)=>{

  const{id,token}=req.params
  const {password}=req.body
  jwt.verify(token,process.env.JWT_Secret_Key,(err,decoded)=>{
    if(err){
      return res.status(401).json({message:"Invalid Token"})
    }
    else{
      bcrypt.hash(password,10)
       .then(hash=>{
        User.findByIdAndUpdate({_id:id},{password:hash})
        .then((ele)=>res.send({status:"Password updated"}))
        .catch((err)=>res.send({status:err}))
       })
       .catch((err)=>res.send({status:err}))
    }
    
  })

}