import asyncHandler from "../middleware/asyncHandler.js";
import Task from "../models/taskModel.js";

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, day, priority, notes } = req.body;

  if (!title || !day) {
    res.status(400);
    throw new Error("Title and day are required");
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    day,
    priority,
    notes,
  });

  res.status(201).json(task);
});

// @desc    Get tasks for a day (or all)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { day } = req.query;
  const filter = { user: req.user._id };

  if (day) {
    const start = new Date(day);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    filter.day = { $gte: start, $lte: end };
  }

  const tasks = await Task.find(filter).sort({ day: 1, createdAt: -1 });
  res.json(tasks);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Task not found");
  }

  const updates = ["title", "day", "priority", "notes", "done"];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  const updated = await task.save();
  res.json(updated);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.json({ message: "Task removed" });
});

export { createTask, getTasks, updateTask, deleteTask };
