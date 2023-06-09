import express from "express";
import costumerController from "../controllers/costumer.controller.js";

const router = express.Router();

router.get("/bring/:costumerId", costumerController.getCostumerById);
router.get("/costumer-list", costumerController.getCostumerList);
router.post("/create", costumerController.createCostumer);
router.delete("/delete/:costumerId", costumerController.deleteCostumer);

export default router;
