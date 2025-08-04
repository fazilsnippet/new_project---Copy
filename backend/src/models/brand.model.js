import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
name:{
    type:String,
    required: true,
    lowercase: true,
    unique:true
},
image: {
  type: String,
  required: true
},
description:{
    type:String
},
 category: {
     type: mongoose.Schema.Types.ObjectId, ref: 'Category',
      required: true },

isTopBrand: {
  type: Boolean,
  default: false,
}

})

export  const Brand = mongoose.model("Brand", brandSchema);
