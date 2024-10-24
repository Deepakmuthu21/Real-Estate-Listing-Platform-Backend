import jwt from"jsonwebtoken"
import User from "../Models/userSchema.js"
import dotenv from "dotenv";
dotenv.config();


const authMiddleware = async(req,res,next)=>{
    const token = req.header('Authorization')
    if(!token){
       return res.status(401).json({message:"Token not found"})
    }
    try {
       const decode = jwt.verify(token,process.env.JWT_Secret_Key)
       req.user = decode
       //console.log(req.user);
       const user = await User.findById(req.user._id)
if(!user){
   return res.status(401).json({message:"Invalid User"})  // return 401 if user not found in database
 
}
      next()
    } catch (error) {
       console.log(error);
       res.status(500).json({message:"Invalid Token Internal Server Error"})
    }
}

export default authMiddleware;