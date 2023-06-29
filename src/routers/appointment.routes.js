import express from "express";
import appointmentController from "../controllers/appointment.controller";

const router = express.Router();

router.post("/create", appointmentController.createAppointment);
router.delete(
  "/cancel/:appointmentId",
  appointmentController.cancelAppointment
);

export default router;
