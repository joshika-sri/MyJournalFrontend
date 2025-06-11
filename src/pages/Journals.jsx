import React, { useEffect, useState, useRef } from "react";
import { FaPlusCircle, FaEdit, FaTrash, FaExpand, FaCompress, FaSmile, FaMeh, FaFrown, FaGrinStars, FaAngry, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const moodOptions = [
  { icon: <FaGrinStars className="text-yellow-400" />, value: "excited", label: "Excited" },
  { icon: <FaSmile className="text-green-500" />, value: "happy", label: "Happy" },
  { icon: <FaMeh className="text-yellow-500" />, value: "neutral", label: "Neutral" },
  { icon: <FaFrown className="text-red-500" />, value: "sad", label: "Sad" },
  { icon: <FaAngry className="text-red-800" />, value: "angry", label: "Angry" },
];

const Journals = () => {
  const [journals, setJournals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStory, setEditStory] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editMood, setEditMood] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [listWidth, setListWidth] = useState(33); // percent
  const [dragging, setDragging] = useState(false);
  const [showListMobile, setShowListMobile] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef();

  useEffect(() => {
    async function fetchJournals() {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const userId = user?._id;
      if (!userId) return;
      try {
        const response = await fetch(`https://my-journal-cc3m.vercel.app/api/journals/${userId}`);
        const data = await response.json();
        setJournals(data);
        if (data.length > 0) setSelected(0);
      } catch (err) {
        setJournals([]);
      }
    }
    fetchJournals();
  }, []);

  // Drag to resize (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      let percent = ((e.clientX - rect.left) / rect.width) * 100;
      if (percent < 15) percent = 15;
      if (percent > 60) percent = 60;
      setListWidth(percent);
    };
    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const handleSelect = (idx) => {
    setSelected(idx);
    setIsEditing(false);
    // On mobile, hide list and show journal
    if (window.innerWidth < 768) setShowListMobile(false);
  };

  const handleDelete = async (idx) => {
    if (!window.confirm("Are you sure you want to delete this journal?")) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const userId = user?._id;
    const journalId = journals[idx]._id;
    try {
      const response = await fetch(`https://my-journal-cc3m.vercel.app/api/journals/${journalId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error("Failed to delete journal");
      // Remove from UI
      const updated = journals.filter((_, i) => i !== idx);
      setJournals(updated);
      setSelected(updated.length > 0 ? 0 : null);
      toast.success("Journal deleted!");
    } catch (err) {
      toast.error("Error deleting journal.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditStory(journals[selected].story);
    setEditTitle(journals[selected].title);
    setEditMood(journals[selected].mood || "");
  };

  const handleSaveEdit = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const userId = user?._id;
    const journalId = journals[selected]._id;
    try {
      const response = await fetch(`https://my-journal-cc3m.vercel.app/api/journals/${journalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: editTitle,
          story: editStory,
          mood: editMood,
        }),
      });
      if (!response.ok) throw new Error("Failed to update journal");
      // Refresh journals list
      const updated = [...journals];
      updated[selected] = {
        ...updated[selected],
        title: editTitle,
        story: editStory,
        mood: editMood,
      };
      setJournals(updated);
      setIsEditing(false);
      toast.success("Journal updated!");
    } catch (err) {
      toast.error("Error updating journal.");
    }
  };

  const handleMoodChange = (mood) => {
    if (!isEditing) return;
    setEditMood(mood);
  };

  // Responsive: show list or journal on mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex bg-white/70 transition-all duration-300 relative ${fullScreen ? "flex-col" : ""} ${
        isMobile ? "flex-col" : ""
      }`}
    >
      {/* Left: Journals List */}
      {!fullScreen && (showListMobile || !isMobile) && (
        <div
          style={
            isMobile
              ? { width: "100%", minWidth: 0, maxWidth: "100%" }
              : { width: `${listWidth}%`, minWidth: 180, maxWidth: 500 }
          }
          className={`border-r border-orange-200 bg-white/80 p-6 transition-all duration-300 ${
            isMobile ? "border-r-0 border-b" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-orange-700">My Journals</h2>
            <button
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition"
              onClick={() => navigate("/journals/select-bg")}
            >
              <FaPlusCircle /> New
            </button>
          </div>
          <ul className="space-y-3">
            {journals.length === 0 && (
              <li className="text-gray-500 italic">No journals yet.</li>
            )
            }
            {journals.map((j, idx) => (
              <li
                key={idx}
                className={`cursor-pointer p-3 rounded-lg transition ${
                  selected === idx
                    ? "bg-orange-100 border-l-4 border-orange-600 font-bold"
                    : "hover:bg-orange-50"
                }`}
                onClick={() => handleSelect(idx)}
              >
                <div className="text-sm text-gray-600">
                  {j.date} ({j.day}, {j.year})
                </div>
                <div className="text-lg flex items-center gap-2">
                  {j.title || "Untitled"}
                  {j.mood && (
                    <span title={j.mood}>
                      {j.mood === "excited" && <FaGrinStars className="text-yellow-400" />}
                      {j.mood === "happy" && <FaSmile className="text-green-500" />}
                      {j.mood === "neutral" && <FaMeh className="text-yellow-500" />}
                      {j.mood === "sad" && <FaFrown className="text-red-500" />}
                      {j.mood === "angry" && <FaAngry className="text-red-800" />}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Slider/Dragger (desktop only) */}
      {!fullScreen && !isMobile && (
        <div
          onMouseDown={() => setDragging(true)}
          className="cursor-col-resize w-2 bg-orange-300 hover:bg-orange-500 transition-all duration-200"
          style={{
            zIndex: 10,
            userSelect: "none",
            position: "relative",
          }}
        />
      )}
      {/* Right: Selected Journal */}
      {(!isMobile || !showListMobile) && (
        <div
          className={`flex-1 p-4 sm:p-8 flex flex-col items-center justify-start min-h-screen transition-all duration-300 ${
            fullScreen ? "w-full" : ""
          }`}
        >
          {/* Back button for mobile */}
          {isMobile && (
            <button
              className="flex items-center gap-2 mb-4 bg-orange-200 hover:bg-orange-400 text-orange-900 font-semibold py-1 px-3 rounded transition self-start"
              onClick={() => setShowListMobile(true)}
            >
              <FaChevronLeft /> Back to Journals
            </button>
          )}
          <div className="w-full flex justify-end mb-2">
            <button
              className="flex items-center gap-2 bg-orange-200 hover:bg-orange-400 text-orange-900 font-semibold py-1 px-3 rounded transition"
              onClick={() => setFullScreen((f) => !f)}
              title={fullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {fullScreen ? <FaCompress /> : <FaExpand />}
              {fullScreen ? "Exit Full Screen" : "Full Screen"}
            </button>
          </div>
          {journals.length === 0 || selected === null ? (
            <div className="text-gray-500 italic mt-16">
              Select a journal to view.
            </div>
          ) : (
            <div
              className={`w-full max-w-2xl rounded-lg shadow-lg p-4 sm:p-8 ${
                journals[selected].background || ""
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div>
                  <div className="text-xs text-gray-700">
                    {journals[selected].date} ({journals[selected].day},{" "}
                    {journals[selected].year})
                  </div>
                  {isEditing ? (
                    <input
                      className="text-2xl font-bold text-orange-700 w-full border-b-2 border-orange-400 bg-transparent outline-none"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                  ) : (
                    <div className="text-2xl font-bold text-orange-700">
                      {journals[selected].title}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-2 sm:mt-0">
                  {!isEditing && (
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                        onClick={handleEdit}
                      >
                        <FaEdit size={22} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        onClick={() => handleDelete(selected)}
                      >
                        <FaTrash size={22} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* Mood selection */}
              <div className="mb-4 flex items-center gap-4 flex-wrap">
                <span className="font-semibold">Mood:</span>
                {isEditing ? (
                  <div className="flex gap-3 items-center flex-wrap">
                    {moodOptions.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        className={`p-2 rounded-full border-2 ${
                          editMood === m.value
                            ? "border-orange-600 bg-orange-100"
                            : "border-transparent"
                        }`}
                        onClick={() => handleMoodChange(m.value)}
                        title={m.label}
                      >
                        {m.icon}
                      </button>
                    ))}
                    {/* Mood legend */}
                    <div className="flex flex-col ml-6 text-xs text-gray-700 gap-1">
                      <div className="flex items-center gap-1"><FaGrinStars className="text-yellow-400" /> Excited</div>
                      <div className="flex items-center gap-1"><FaSmile className="text-green-500" /> Happy</div>
                      <div className="flex items-center gap-1"><FaMeh className="text-yellow-500" /> Neutral</div>
                      <div className="flex items-center gap-1"><FaFrown className="text-red-500" /> Sad</div>
                      <div className="flex items-center gap-1"><FaAngry className="text-red-800" /> Angry</div>
                    </div>
                  </div>
                ) : (
                  <span>
                    {journals[selected].mood === "excited" && (
                      <span className="flex items-center gap-1">
                        <FaGrinStars className="text-yellow-400" /> Excited
                      </span>
                    )}
                    {journals[selected].mood === "happy" && (
                      <span className="flex items-center gap-1">
                        <FaSmile className="text-green-500" /> Happy
                      </span>
                    )}
                    {journals[selected].mood === "neutral" && (
                      <span className="flex items-center gap-1">
                        <FaMeh className="text-yellow-500" /> Neutral
                      </span>
                    )}
                    {journals[selected].mood === "sad" && (
                      <span className="flex items-center gap-1">
                        <FaFrown className="text-red-500" /> Sad
                      </span>
                    )}
                    {journals[selected].mood === "angry" && (
                      <span className="flex items-center gap-1">
                        <FaAngry className="text-red-800" /> Angry
                      </span>
                    )}
                    {!journals[selected].mood && <span className="text-gray-400">Not set</span>}
                  </span>
                )}
              </div>
              <div
                className="bg-white bg-opacity-80 rounded-lg p-4 sm:p-6 mt-4"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 23px, #e5e7eb 24px)",
                  backgroundSize: "100% 24px",
                  minHeight: "300px",
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: "1.1rem",
                  lineHeight: "1.7",
                }}
              >
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[200px] bg-transparent outline-none text-lg font-medium leading-relaxed"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent, transparent 23px, #e5e7eb 24px)",
                      backgroundSize: "100% 24px",
                    }}
                    value={editStory}
                    onChange={e => setEditStory(e.target.value)}
                  />
                ) : (
                  journals[selected].story
                )}
              </div>
              {isEditing && (
                <div className="flex gap-4 mt-4 justify-end">
                  <button
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded transition"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded transition"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Journals;
