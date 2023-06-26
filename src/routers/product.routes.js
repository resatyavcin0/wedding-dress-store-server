import express from "express";
import productController from "../controllers/product.controller.js";

const router = express.Router();

router.post("/create", productController.createProduct);
router.get("/groupByCategory", productController.groupList);
router.get("/list", productController.productList);
router.delete("/delete/:id", productController.deleteProduct);

export default router;
