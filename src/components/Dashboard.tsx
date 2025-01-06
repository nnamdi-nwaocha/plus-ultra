"use client";

import { useState, useEffect } from "react";

interface ProgressLog {
  username: string;
  completed_tasks: number;
  pending_tasks: number;
  date?: string;
}

export default function Dashboard() {
  const [todayProgress, setTodayProgress] = useState<ProgressLog[]>([]);
  const [historicalProgress, setHistoricalProgress] = useState<ProgressLog[]>(
    []
  );

  useEffect(() => {
    fetchTodayProgress();
    fetchHistoricalProgress();
  }, []);

  async function fetchTodayProgress() {
    const response = await fetch("/api/progress");
    if (response.ok) {
      const data = await response.json();
      setTodayProgress(data);
    } else {
      console.log("Error fetching today's progress:", await response.text());
    }
  }

  async function fetchHistoricalProgress() {
    const response = await fetch("/api/progress?days=7");
    if (response.ok) {
      const data = await response.json();
      setHistoricalProgress(data);
    } else {
      console.log("Error fetching historical progress:", await response.text());
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Today's Progress</h3>
        <ul>
          {todayProgress.map((log, index) => (
            <li key={index} className="mb-2">
              {log.username}: {log.completed_tasks} completed,{" "}
              {log.pending_tasks} pending
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Historical Progress</h3>
        <ul>
          {historicalProgress.map((log, index) => (
            <li key={index} className="mb-2">
              {log.date}: {log.username} - {log.completed_tasks} completed,{" "}
              {log.pending_tasks} pending
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
