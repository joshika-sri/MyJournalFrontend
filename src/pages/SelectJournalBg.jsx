import React from "react";
import { useNavigate } from "react-router-dom";

const backgrounds = [
  { name: "Pink Pattern", className: "bg-pink-pattern" },
  { name: "Purple Pattern", className: "bg-purple-pattern" },
  { name: "Radial Pink Circles", className: "bg-radial-pink-circles" },
  { name: "Blue-Yellow Grid", className: "bg-blue-yellow-grid" },
  { name: "Futuristic Purple", className: "bg-futuristic-pattern" },
  { name: "Grey Grid", className: "bg-grey-grid" },
];

function SelectJournalBg() {
  const navigate = useNavigate();

  const handleSelect = (bgClass) => {
    navigate("/journals/create", { state: { bgClass } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-pattern">
      <h2 className="text-3xl font-bold mb-8 text-orange-700">
        Choose a Journal Background
      </h2>
      <div className="flex flex-wrap gap-8 justify-center">
        {backgrounds.map((bg) => (
          <button
            key={bg.name}
            className={`w-32 h-32 rounded-lg shadow-lg border-4 border-gray-500 hover:border-gray-800 transition bg-white/60 p-1 flex flex-col items-end justify-end relative overflow-hidden`}
            style={{ outline: "2px solid #000000" }}
            onClick={() => handleSelect(bg.className)}
            aria-label={bg.name}
            title={bg.name}
          >
            <div className={`absolute inset-0 rounded-md ${bg.className}`} />
            <span className="relative z-10 text-xs font-bold bg-white/80 px-2 py-1 rounded m-2 text-orange-800 shadow">
              {bg.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelectJournalBg;