// routes/brand.routes.js

import express from "express";
import { getBrandById, getAllBrands, getProductsByBrand } from "../controllers/brand.controller.js";

const brandRouter = express.Router();

brandRouter.get("/getAllBrands", getAllBrands)
brandRouter.get("/:brandId", getBrandById)
brandRouter.get("/:brandId/products", getProductsByBrand);


export default brandRouter;
