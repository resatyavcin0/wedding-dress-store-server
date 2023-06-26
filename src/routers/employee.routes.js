import express from "express";
import employeeController from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/bring/:userId", employeeController.getUserById);
router.get("/user-list", employeeController.getUserListWithUserRole);
router.post("/create", employeeController.createUser);
router.delete("/delete/:userId", employeeController.deleteUserById);
router.put("/update/:userId", employeeController.updateUserById);

export default router;
