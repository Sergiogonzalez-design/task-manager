import { useEffect, useState } from "react"
import { supabase } from "./supabase"

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // 1️⃣ Check if a session already exists
      const {
        data: { session }
      } = await supabase.auth.getSession()

      let currentUser = session?.user

      // 2️⃣ If no session, create anonymous guest
      if (!currentUser) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
          setError(error.message)
          setLoading(false)
          return
        }
        currentUser = data.user
      }

      setUser(currentUser)

      // 3️⃣ Fetch tasks for this user
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })

      if (tasksError) {
        setError(tasksError.message)
      } else {
        setTasks(tasksData)
      }

      setLoading(false)
    }

    init()
  }, [])

  // ➕ Add task
  const addTask = async () => {
    if (!newTask.trim()) return

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: newTask,
          user_id: user.id
        }
      ])
      .select()

    if (error) {
      setError(error.message)
      return
    }

    setTasks([data[0], ...tasks])
    setNewTask("")
  }

  // ✅ Toggle task complete
  const toggleTask = async (task) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ is_complete: !task.is_complete })
      .eq("id", task.id)
      .select()

    if (error) {
      setError(error.message)
      return
    }

    setTasks(tasks.map(t => (t.id === task.id ? data[0] : t)))
  }

  // ⏳ Loading / Error UI
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Task Manager</h1>
      <p style={{ fontSize: "0.9rem", color: "#555" }}>
        Guest User ID: {user.id}
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={addTask} style={{ padding: "0.5rem 1rem" }}>
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} style={{ marginBottom: "0.5rem" }}>
              <input
                type="checkbox"
                checked={task.is_complete}
                onChange={() => toggleTask(task)}
                style={{ marginRight: "0.5rem" }}
              />
              <span style={{ textDecoration: task.is_complete ? "line-through" : "none" }}>
                {task.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App




