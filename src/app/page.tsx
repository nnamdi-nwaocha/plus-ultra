"use client";

import React, { useState, useEffect } from "react";
import Login from "@/components/Login";
import TaskList from "@/components/TaskList";
import Dashboard from "@/components/Dashboard";
import { User, Task } from "../app/types";

const USERS: User[] = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" },
  { username: "user3", password: "pass3" },
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Initialize data if it doesn't exist
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        if (Object.keys(data).length === 0) {
          const initialData = USERS.reduce((acc, user) => {
            acc[user.username] = { tasks: [], completedTasks: {} };
            return acc;
          }, {} as Record<string, { tasks: Task[]; completedTasks: Record<string, string[]> }>);
          fetch("/api/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initialData),
          });
        }
      });
  }, []);

  const handleLogin = (username: string, password: string) => {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowDashboard(false);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Productivity Tracker</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Logout
      </button>
      <button
        onClick={() => setShowDashboard(!showDashboard)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 ml-2"
      >
        {showDashboard ? "Show My Tasks" : "Show Dashboard"}
      </button>
      {showDashboard ? (
        <Dashboard />
      ) : (
        <TaskList username={currentUser.username} />
      )}
    </div>
  );
}
