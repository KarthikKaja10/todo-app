import { useEffect, useState } from "react";
import "./App.css";

const API = "https://todo-app-backend-n01i.onrender.com/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    status: "",
    deadline: ""
  });

  // Fetch tasks
  useEffect(() => {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      console.log(Array.isArray(data));
      setTasks(data);
    })
    .catch(err => console.log(err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add task
  const addTask = async () => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        status: form.status,
        deadline: form.deadline,
        completed: false
      })
    });

    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setForm({ title: "", status: "", deadline: "" });
  };

  // Delete
  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t._id !== id));
  };

  // Edit
  const editTask = async (task) => {
    const newTitle = prompt("Edit task:", task.title);
    if (!newTitle) return;

    const res = await fetch(`${API}/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle })
    });

    const updated = await res.json();
    setTasks(tasks.map(t => (t._id === task._id ? updated : t)));
  };

  return (
    <div className="app">
      <h1>Todo List</h1>

      <div className="layout">
        
        {/* LEFT: TABLE */}
        <div className="table-section">
          <h2>Todo List</h2>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.status || "Pending"}</td>
                  <td>{task.deadline || "-"}</td>
                  <td>
                    <button className="edit" onClick={() => editTask(task)}>Edit</button>
                    <button className="delete" onClick={() => deleteTask(task._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: FORM */}
        <div className="form-section">
          <h2>Add Task</h2>

          <label>Task</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter Task"
          />

          <label>Status</label>
          <input
            name="status"
            value={form.status}
            onChange={handleChange}
            placeholder="Enter Status"
          />

          <label>Deadline</label>
          <input
            type="datetime-local"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />

          <button onClick={addTask} className="add-btn">
            Add Task
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;