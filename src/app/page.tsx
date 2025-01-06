"use client";

import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import Auth from "../components/Auth";
import TaskList from "../components/TaskList";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function updateProgressLog() {
    if (!session) return;

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("status")
      .eq("user_id", session.user.id)
      .eq("date", new Date().toISOString().split("T")[0]);

    if (tasksError) {
      console.log("Error fetching tasks for progress update:", tasksError);
      return;
    }

    const completed_tasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pending_tasks = tasks.filter(
      (task) => task.status === "pending"
    ).length;

    const response = await fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: session.user.id,
        completed_tasks,
        pending_tasks,
      }),
    });

    if (!response.ok) {
      console.log("Error updating progress log:", await response.text());
    }
  }

  useEffect(() => {
    if (session) {
      updateProgressLog();
    }
  }, [session]);

  return (
    <div className="container mx-auto px-4">
      {!session ? (
        <Auth />
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Productivity Tracker</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 mb-4"
          >
            Sign Out
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskList />
            <Dashboard />
          </div>
        </div>
      )}
    </div>
  );
}
