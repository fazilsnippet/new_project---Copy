

import mongoose from "mongoose";
import { Product } from "../src/models/product.model.js";
import { Brand } from "../src/models/brand.model.js"; // ✅ Required for populate to work

const run = async () => {
    await mongoose.connect("mongodb+srv://fazil:fazil123@fazak.5hyej.mongodb.net/?retryWrites=true&w=majority&appName=fazak"); // replace with your actual URI

  const products = await Product.find().populate({
    path: "brand",
    options: { strictPopulate: false },
  });

  console.log("Fetched products:", products);
  await mongoose.disconnect();
};

run();
