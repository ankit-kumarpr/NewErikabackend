const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  
  id: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  product_image: {
    type: String,
    required: true,
  },

//   price per unit
  price:{                       
    type:Number,
    
  },
  Pack_size:{
    type:String,
    require:true
  },
  is_deleted:{
    type:Boolean,
    default:0
  }
});

module.exports = mongoose.model("Product", ProductSchema);
