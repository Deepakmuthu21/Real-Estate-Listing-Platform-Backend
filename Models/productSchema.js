import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    bed: {
      type: String,
    },
    baths: {
      type: String,
    },
    location: {
      type: String,
    },
    
    price: {
      type: String,
    },
   

   }
);

const Products = mongoose.model("Products", productSchema);

export default Products;
