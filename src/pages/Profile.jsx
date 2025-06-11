import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    setUser(currentUser);
    setForm(currentUser);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, profilePic: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // Update user in backend here if needed, else just localStorage for now
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users = users.map((u) =>
      u.username === user.username ? { ...form } : u
    );
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(form));
    setUser(form);
    setEdit(false);
    setMsg("Profile updated!");
    setTimeout(() => setMsg(""), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    alert("You have been logged out.");
    navigate("/signin");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300 font-delius">
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-10 mx-2">
        <h2 className="text-3xl font-extrabold text-orange-700 mb-2 text-center">
          Profile
        </h2>
        <div className="flex flex-col items-center mb-6">
          <img
            src={form.profilePic || user.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-orange-300 object-cover shadow mb-2"
          />
          {edit && (
            <label className="block mt-2 text-orange-700 font-medium cursor-pointer">
              <span className="underline">Change Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePicChange}
              />
            </label>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <label className="font-bold text-orange-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            disabled={!edit}
            onChange={handleChange}
            className="rounded-lg border border-orange-300 px-4 py-2 bg-orange-50"
          />
          <label className="font-bold text-orange-700">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            disabled
            className="rounded-lg border border-orange-300 px-4 py-2 bg-orange-50"
          />
          <label className="font-bold text-orange-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled={!edit}
            onChange={handleChange}
            className="rounded-lg border border-orange-300 px-4 py-2 bg-orange-50"
          />
          <label className="font-bold text-orange-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            disabled={!edit}
            onChange={handleChange}
            className="rounded-lg border border-orange-300 px-4 py-2 bg-orange-50"
          />
        </div>
        {msg && <div className="text-green-600 text-center mt-2">{msg}</div>}
        <div className="flex justify-between mt-6">
          {edit ? (
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
              onClick={() => setEdit(true)}
            >
              Edit Details
            </button>
          )}
          <button
            className="bg-gray-300 hover:bg-gray-400 text-orange-700 font-bold py-2 px-6 rounded-lg shadow transition"
            onClick={handleLogout}
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}