import express from "express";
import { createProduct,  deleteProduct,  getProduct, productDetail, productDetailById, registerProperty, updateProduct } from "../Controllers/porduct_controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import router from "./userRoute.js";
import multer from "multer";
import Products from "../Models/productSchema.js";


const app = express();

// Increase payload limit for JSON and URL-encoded data
app.use(express.json({ limit: '50mb' })); // Set the limit to 50MB or adjust as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const product_router = express.Router();



product_router.post("/register-product",async (req, res) => {
    try {
       // console.log(req.body);
        
      const { user_id,name,description,bed,baths,location,price} = req.body;
     
  
      const newProduct = new Products( { user_id,name,description,bed,baths,location,price});
///console.log(newProduct);
      
      await newProduct.save();
      res
        .status(200)
        .json({ messege: "Property Register Successfully", data: [newProduct] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ messege: "Server Error in creating Product" });
    }
  })
product_router.get('/get-product',getProduct);
product_router.get('/getproductdetail/:id',productDetail);
product_router.get('/getproductbyId/:id',productDetailById);
product_router.put('/update-product/:id',updateProduct)
product_router.delete('/delete-product/:id',deleteProduct)
product_router.post('/register-Proprety',registerProperty)




export default product_router;