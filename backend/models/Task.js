const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  status: String,
  deadline: String,
  completed: Boolean
});

module.exports = mongoose.model("Task", taskSchema);