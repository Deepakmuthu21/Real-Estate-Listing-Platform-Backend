import Products from "../Models/productSchema.js";
import User from "../Models/userSchema.js";
import nodemailer from "nodemailer";



export const createProduct = async (req, res) => {
    try {
      const { user_id,name,descripition,bed,baths,location,price } = req.body;
     
  
      const newProduct = new Products( { user_id,name,descripition,bed,baths,location,price });
  
      
      await newProduct.save();
      res
        .status(200)
        .json({ messege: "Property Register Successfully", data: [newProduct] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ messege: "Server Error in creating Product" });
    }
  };



  export const getProduct = async (req, res) => {
    try {
      const product = await Products.find();
      res
        .status(200)
        .json({ message: "Product fetched successfully", result: product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error in Get Product" });
    }
  };

export const productDetail = async(req,res)=>{

  try {
        const userId  = req.params.id

    //const userId = req.user._id
    const products = await Products.find({user_id:userId})
    //const email  = req.params.id

    //const products = await Products.find({user_id:email})
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    
    }
    res.status(200).json({ message: "Product fetched successfully", result: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error in product Detail" });
  }



}

export const productDetailById = async(req,res)=>{

  try {

    const productId  = req.params.id

    const product = await Products.find({_id:productId})
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    
    }
    res.status(200).json({ message: "Product fetched successfully", result: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error in product Detail" });
  }



}

export const updateProduct = async(req,res)=>{

  try{
const productId = req.params.id
const  {
  name,
  descripition,
  bed,
  baths,
  location,
  price
}=req.body

const updatedProduct = await Products.updateOne({_id:productId},{
  name,
  descripition,
  bed,
  baths,
  location,
  price
})

if(updateProduct.matchedCount === 0) {
  return res.status(404).json({ message: "Product Not Found" });
} 
const updatedProducr =await Products.find({_id:productId})
res.status(200).json({messege:"Product Updated Successfully",result:updatedProduct})
  }
  catch{

    console.log(error);
    res.status(500).json({ message: "Internal Server Error in updating product" });
  }
} 

export const deleteProduct = async(req,res)=>{
  try {
    const productId = req.params.id
    const deleteProduct= await Products.deleteOne({_id:productId})
    if(!deleteProduct){
      return res.status(404).send("Employee Not Found");
    }
    res.status(200).json({ messege: "Property  Deleted Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error in Delete Product");
  }
}


export const registerProperty = async (req, res) => {

  const {date,number,location,buyer,id} = req.body
  const product = await Products.findById({_id:id})
  console.log(product.user_id);
  const user = await User.find({email:buyer})
  console.log(user);
  
  if(!product){
    return res.status(404).json({message:"Product Not Found"})
  }
  //const token = jwt.sign({_id:user._id},process.env.JWT_Secret_Key,{expiresIn:"1d"})
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
  from :buyer ,
  to:product.user_id,
  subject:"To Get Appointment",
  text:`Requested Property \nProperty Id : ${product._id}\n${product.name}\n${product.location}\n`+`
  Buyer Details\n`+`Name:${user[0].name}\nEmail:${user[0].email}\n\nMeeting Date : ${date}\nMeeting Location : ${location}\n Contact : ${number}`

}

transporter.sendMail(mailOptions,(error,info)=>{
  if(error){
    console.log(error)
    return res.status(500).json({message:"Register Failed"})
  }else{
    return res.status(200).json({message:"Property register successfully"})
  }
}
)
}