import React from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.png"; // Make sure you have a hero.png in your assets folder

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-200 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left: Text Content */}
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-3xl sm:text-6xl font-extrabold text-orange-700 mb-4">
            Welcome to My Journal
          </h1>
          <p className="text-lg sm:text-2xl text-gray-700 mb-8">
            Your safe space to write, track your mood, and export your memories.
          </p>
          <button
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition mb-4"
            onClick={() => navigate("/signup")}
          >
            Begin Your Story - Get Started Now
          </button>
        </div>
        {/* Right: Image with accent lines */}
        <div className="md:w-1/2 flex justify-center relative">
          <img
            src={heroImg}
            alt="Journal Illustration"
            className="w-120 max-w-full rounded-lg shadow-lg relative z-10"
          />
          {/* Right line */}
          <span className="absolute right-2 top-8 h-2/3 w-1 bg-orange-400 rounded-full z-0"></span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;