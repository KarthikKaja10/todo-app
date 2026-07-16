const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

mongoose.connect("mongodb+srv://testuser:YhhXYSN#4if#L3@cluster0.ana53sr.mongodb.net/?appName=Cluster0")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const Task = require("./models/Task");

// Root route (optional health check)
app.get("/", (req, res) => {
  res.json({ message: "Todo API is running!" });
});

// GET all tasks
app.get("/tasks", async (req, res) => {
  console.log("GET /tasks called");
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE a task (mark complete / edit)
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});

// http://127.0.0.1:5001
// http://127.0.0.1:5001/tasks