import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createAppointment)
  .get(protect, getAppointments);

router
  .route("/:id")
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

export default router;
