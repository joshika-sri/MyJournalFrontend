import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
const defaultProfile =
  "https://ui-avatars.com/api/?name=User&background=FFB347&color=fff&font-size=0.4&rounded=true";

const API_URL = "https://my-journal-cc3m.vercel.app/api/users/register";

export default function Signup() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [profilePic, setProfilePic] = useState(defaultProfile);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePic(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, profilePic }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Registration failed, Upload a picture less than 5MB");
        return;
      }
      const user = await res.json();
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast.success(`Welcome ${user.name} 🎉, Start Writing Journals`);
      navigate("/");
    } catch (err) {
      alert("Registration failed ( upload a picture less than 5MB)");
      console.error("Error during registration:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300 font-delius">
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-10 mx-2">
        <h2 className="text-3xl font-extrabold text-orange-700 mb-2 text-center">
          Sign Up
        </h2>
        <p className="text-orange-800 text-center mb-6 font-medium">
          Create your My Journal account
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-2">
            <div className="relative group">
              <img
                src={profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-orange-300 object-cover shadow"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-orange-600 text-white rounded-full p-2 shadow-lg hover:bg-orange-700 transition"
                onClick={() => fileInputRef.current.click()}
                aria-label="Upload profile picture"
              >
                <FaCamera />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePicChange}
              />
            </div>
            <span className="text-xs text-gray-500 mt-2">
              Add Profile Picture
            </span>
          </div>
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="rounded-lg border border-orange-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
            value={form.name}
            onChange={handleChange}
            required
          />
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="rounded-lg border border-orange-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
            value={form.email}
            onChange={handleChange}
            required
          />
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="rounded-lg border border-orange-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
            value={form.username}
            onChange={handleChange}
            required
          />
          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="rounded-lg border border-orange-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
            value={form.password}
            onChange={handleChange}
            required
          />
          {/* Submit */}
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg transition text-lg mt-2"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-orange-800 font-medium">Already an user?</span>
          <button
            className="ml-2 text-orange-600 font-bold underline hover:text-orange-800 transition"
            onClick={() => navigate("/signin")}
            type="button"
          >
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
}