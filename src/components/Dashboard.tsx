"use client";

import React, { useState, useEffect } from "react";
import { User, Task } from "../app/types";

const USERS: User[] = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" },
  { username: "user3", password: "pass3" },
];

export default function Dashboard() {
  const [data, setData] = useState<
    Record<string, { tasks: Task[]; completedTasks: Record<string, number[]> }>
  >({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/data");
    const savedData = await response.json();
    setData(savedData);
  };

  const calculateProgress = (username: string) => {
    const userTasks = data[username]?.tasks || [];
    const completedTaskIds = data[username]?.completedTasks[selectedDate] || [];
    const completedCount = completedTaskIds.length;
    const totalCount = userTasks.length;
    return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
      <div className="mb-6">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Date
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {USERS.map((user) => (
          <div key={user.username} className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              {user.username}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${calculateProgress(user.username)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {calculateProgress(user.username).toFixed(2)}% completed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
