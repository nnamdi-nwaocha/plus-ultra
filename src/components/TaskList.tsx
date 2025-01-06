"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

interface Task {
  id: string;
  task_name: string;
  expected_time: number;
  status: "pending" | "completed";
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ task_name: "", expected_time: 0 });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.log("Error fetching session:", sessionError);
      return;
    }

    const response = await fetch("/api/tasks");
    if (response.ok) {
      const data = await response.json();
      setTasks(data);
    } else {
      console.log("Error fetching tasks:", await response.text());
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.log("Error fetching session:", sessionError);
      return;
    }

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newTask,
        user_id: sessionData.session?.user.id,
      }),
    });

    if (response.ok) {
      setNewTask({ task_name: "", expected_time: 0 });
      fetchTasks();
    } else {
      console.log("Error adding task:", await response.text());
    }
  }

  async function updateTaskStatus(id: string, status: "pending" | "completed") {
    const response = await fetch("/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    if (response.ok) {
      fetchTasks();
    } else {
      console.log("Error updating task:", await response.text());
    }
  }

  async function deleteTask(id: string) {
    const response = await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchTasks();
    } else {
      console.log("Error deleting task:", await response.text());
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Today's Tasks</h2>
      <form onSubmit={addTask} className="mb-4">
        <input
          type="text"
          placeholder="Task name"
          value={newTask.task_name}
          onChange={(e) =>
            setNewTask({ ...newTask, task_name: e.target.value })
          }
          className="px-4 py-2 border rounded mr-2"
        />
        <input
          type="number"
          placeholder="Expected time (minutes)"
          value={newTask.expected_time}
          onChange={(e) =>
            setNewTask({ ...newTask, expected_time: parseInt(e.target.value) })
          }
          className="px-4 py-2 border rounded mr-2"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Add Task
        </button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 p-2 border rounded">
            <span className={task.status === "completed" ? "line-through" : ""}>
              {task.task_name} ({task.expected_time} minutes)
            </span>
            <button
              onClick={() =>
                updateTaskStatus(
                  task.id,
                  task.status === "pending" ? "completed" : "pending"
                )
              }
              className="ml-2 px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {task.status === "pending" ? "Complete" : "Undo"}
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="ml-2 px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
