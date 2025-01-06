"use client";

import { useState } from "react";
import { supabase } from "../utils/supabase";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // Insert the user into the users table
      const user = data.user;
      if (user) {
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ id: user.id, email: user.email }]);

        if (insertError) throw insertError;
      }

      console.log("User signed up and inserted into users table:", data);
      alert("Check your email for the login link!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Sign up error:", error);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <form onSubmit={handleSignUp} className="flex flex-col space-y-4 mt-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
