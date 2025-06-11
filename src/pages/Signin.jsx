import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "https://my-journal-cc3m.vercel.app/api/users/login";
export default function Signin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }
      const user = await res.json();
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/");
      toast.success(`Logged in! Welcome ${user.name} 🎉`);
    } catch (err) {
      setError("Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300 font-delius">
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-10 mx-2">
        <h2 className="text-3xl font-extrabold text-orange-700 mb-2 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="rounded-lg border border-orange-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="rounded-lg border border-orange-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-red-600 text-center">{error}</div>}
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg transition text-lg mt-2"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-orange-800 font-medium">New user?</span>
          <button
            className="ml-2 text-orange-600 font-bold underline hover:text-orange-800 transition"
            onClick={() => navigate("/signup")}
            type="button"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}