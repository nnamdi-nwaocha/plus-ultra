"use client";

import React, { useState, useEffect } from "react";
import { Task } from "../app/types";

interface TaskListProps {
  username: string;
}

export default function TaskList({ username }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ name: "", expectedTime: "" });

  useEffect(() => {
    fetchTasks();
  }, [username]);

  const fetchTasks = async () => {
    const response = await fetch("/api/data");
    const data = await response.json();
    setTasks(data[username]?.tasks || []);
  };

  const saveData = async (updatedTasks: Task[]) => {
    const response = await fetch("/api/data");
    const data = await response.json();
    data[username] = { ...data[username], tasks: updatedTasks };
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const addTask = async () => {
    if (newTask.name && newTask.expectedTime) {
      const updatedTasks = [...tasks, { ...newTask, id: Date.now() }];
      setTasks(updatedTasks);
      await saveData(updatedTasks);
      setNewTask({ name: "", expectedTime: "" });
    }
  };

  const deleteTask = async (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    await saveData(updatedTasks);
  };

  const toggleTask = async (id: number) => {
    const response = await fetch("/api/data");
    const data = await response.json();
    const today = new Date().toISOString().split("T")[0];
    data[username].completedTasks = data[username].completedTasks || {};
    data[username].completedTasks[today] =
      data[username].completedTasks[today] || [];

    const taskIndex = data[username].completedTasks[today].indexOf(id);
    if (taskIndex > -1) {
      data[username].completedTasks[today].splice(taskIndex, 1);
    } else {
      data[username].completedTasks[today].push(id);
    }

    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setTasks([...tasks]); // Force re-render
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Tasks</h2>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Task name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="flex-grow border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Expected time (minutes)"
            value={newTask.expectedTime}
            onChange={(e) =>
              setNewTask({ ...newTask, expectedTime: e.target.value })
            }
            className="w-full md:w-48 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addTask}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Add Task
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                onChange={() => toggleTask(task.id)}
                className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                {task.name}{" "}
                <span className="text-sm text-gray-500">
                  ({task.expectedTime} minutes)
                </span>
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-300 ease-in-out"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
