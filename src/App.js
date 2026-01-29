import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium"); // Updated to medium
  const [dueDate, setDueDate] = useState(null);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask) return;
    const formattedDate = dueDate ? dueDate.toISOString().split("T")[0] : null;

    const { error } = await supabase.from("tasks").insert([
      {
        title: newTask,
        priority,
        due_date: formattedDate,
      },
    ]);

    if (!error) {
      setNewTask("");
      setPriority("medium"); // Reset to medium
      setDueDate(null);
      fetchTasks();
    }
  };

  const toggleTask = async (task) => {
    await supabase
      .from("tasks")
      .update({ is_complete: !task.is_complete })
      .eq("id", task.id);
    fetchTasks();
  };

  // --- NEW FEATURE: DELETE TASK ---
  const deleteTask = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) fetchTasks();
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <div className="inputs">
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          placeholderText="Select due date"
          dateFormat="yyyy-MM-dd"
        />

        <button className="add-task-btn" onClick={addTask}>
          Add Task
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.is_complete ? "completed" : ""}>
            <input
              type="checkbox"
              checked={task.is_complete}
              onChange={() => toggleTask(task)}
            />
            <div className="task-info">
              <strong>{task.title}</strong>
              <span className={`badge ${task.priority}`}>{task.priority}</span>
              {task.due_date && <small> Due: {task.due_date}</small>}
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;









