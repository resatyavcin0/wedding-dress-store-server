import express from "express";
import productController from "../controllers/product.controller.js";

const router = express.Router();

router.post("/create", productController.createProduct);
router.get("/get/:id", productController.getById);
router.get("/groupByCategory", productController.groupList);
router.get("/list", productController.productList);
router.patch("/receive/:productId/:historyId", productController.receivePatch);
router.delete("/delete/:id", productController.deleteProduct);

export default router;
