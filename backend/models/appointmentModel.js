import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    clientName: { type: String },
    clientEmail: { type: String },
    clientPhone: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: { type: String },
    meetingLink: { type: String },
    notes: { type: String },
    color: { type: String, default: "#0b57d0" },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
