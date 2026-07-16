const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Log every incoming request
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// Import Task model
const Task = require("./models/Task");

// ---------------- ROOT ROUTE ----------------
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running!",
  });
});

// ---------------- GET TASKS ----------------
app.get("/tasks", async (req, res) => {
  console.log("GET /tasks called");

  try {
    const tasks = await Task.find();

    console.log("Tasks:", tasks);
    console.log("Is Array:", Array.isArray(tasks));
    console.log("Number of Tasks:", tasks.length);

    res.json(tasks);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- ADD TASK ----------------
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);

    await task.save();

    console.log("Task Added:", task);

    res.json(task);
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- UPDATE TASK ----------------
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedTask);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- DELETE TASK ----------------
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    console.error("DELETE Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- CONNECT DATABASE ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });