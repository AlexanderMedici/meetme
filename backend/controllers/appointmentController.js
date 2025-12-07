import asyncHandler from "../middleware/asyncHandler.js";
import Appointment from "../models/appointmentModel.js";

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const {
    title,
    clientName,
    clientEmail,
    clientPhone,
    start,
    end,
    location,
    meetingLink,
    notes,
    color,
    status,
  } = req.body;

  if (!title || !start || !end) {
    res.status(400);
    throw new Error("Title, start, and end are required");
  }

  const appointment = await Appointment.create({
    user: req.user._id,
    title,
    clientName,
    clientEmail,
    clientPhone,
    start,
    end,
    location,
    meetingLink,
    notes,
    color,
    status,
  });

  res.status(201).json(appointment);
});

// @desc    Get appointments (optionally by date range)
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = { user: req.user._id };

  if (from || to) {
    filter.start = {};
    if (from) filter.start.$gte = new Date(from);
    if (to) filter.start.$lte = new Date(to);
  }

  const appointments = await Appointment.find(filter).sort({ start: 1 });
  res.json(appointments);
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment || appointment.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const updates = [
    "title",
    "clientName",
    "clientEmail",
    "clientPhone",
    "start",
    "end",
    "location",
    "meetingLink",
    "notes",
    "color",
    "status",
  ];

  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      appointment[field] = req.body[field];
    }
  });

  const updated = await appointment.save();
  res.json(updated);
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment || appointment.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  await appointment.deleteOne();
  res.json({ message: "Appointment removed" });
});

export {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
