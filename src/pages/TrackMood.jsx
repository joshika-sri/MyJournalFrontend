import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaSmile,
  FaMeh,
  FaFrown,
  FaGrinStars,
  FaAngry,
  FaRegCalendarAlt,
  FaChevronLeft,
  FaChartBar,
  FaTable,
  FaChartPie,
} from "react-icons/fa";

// Mood icon mapping with descriptions
const moodIcons = {
  excited: {
    icon: <FaGrinStars className="text-yellow-400" title="Excited" />,
    label: "Excited",
  },
  happy: {
    icon: <FaSmile className="text-green-500" title="Happy" />,
    label: "Happy",
  },
  neutral: {
    icon: <FaMeh className="text-yellow-500" title="Neutral" />,
    label: "Neutral",
  },
  sad: {
    icon: <FaFrown className="text-red-500" title="Sad" />,
    label: "Sad",
  },
  angry: {
    icon: <FaAngry className="text-red-800" title="Angry" />,
    label: "Angry",
  },
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfWeek = (year, month) => new Date(year, month, 1).getDay();
const getJournalByDate = (journals, dateStr) => {
  return journals.find((j) => j.date === dateStr);
};

const moodOrder = ["excited", "happy", "neutral", "sad", "angry"]; // for tie-breaker

function getWeeksInMonth(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const weeks = [];
  let week = [];
  let dayOfWeek = firstDay;
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    dayOfWeek++;
    if (week.length === 7) {
      weeks.push(week);
      week = [];
      dayOfWeek = 0;
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function getMajorityMood(moods) {
  if (!moods.length) return null;
  const count = {};
  moods.forEach((m) => {
    if (m) count[m] = (count[m] || 0) + 1;
  });
  let max = 0;
  let maxMoods = [];
  for (const mood in count) {
    if (count[mood] > max) {
      max = count[mood];
      maxMoods = [mood];
    } else if (count[mood] === max) {
      maxMoods.push(mood);
    }
  }
  // Tie-breaker: use moodOrder
  if (maxMoods.length > 1) {
    maxMoods.sort((a, b) => moodOrder.indexOf(a) - moodOrder.indexOf(b));
    return maxMoods[0];
  }
  return maxMoods[0];
}

const chartColors = {
  excited: "bg-yellow-300 border-yellow-400",
  happy: "bg-green-300 border-green-400",
  neutral: "bg-yellow-100 border-yellow-300",
  sad: "bg-red-200 border-red-400",
  angry: "bg-red-400 border-red-600",
};

function getWeeklyMoodStats(weeks, journals, selectedYear, selectedMonth) {
  return weeks.map((week) => {
    const moods = week
      .map((day) => {
        if (!day) return null;
        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;
        const journal = getJournalByDate(journals, dateStr);
        return journal ? journal.mood : null;
      })
      .filter(Boolean);
    const majorityMood = getMajorityMood(moods);
    // Count each mood
    const moodCounts = {};
    moods.forEach((m) => {
      if (m) moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
    return { moods, majorityMood, moodCounts, week };
  });
}

// Enhanced Bar Chart: 5 boxes for 5 weeks, responsive, modern
const MoodChartBar = ({ weeklyStats }) => (
  <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
    {Array.from({ length: 5 }).map((_, idx) => {
      const stat = weeklyStats[idx] || { moodCounts: {}, majorityMood: null };
      return (
        <div
          key={idx}
          className="rounded-xl shadow-lg bg-white border border-orange-200 p-4 flex flex-col items-center min-h-[180px] relative"
        >
          <div className="absolute top-2 right-2 text-xs text-orange-400 font-bold opacity-60">
            {stat.majorityMood && (
              <span className="flex items-center gap-1">
                {moodIcons[stat.majorityMood].icon}
                {moodIcons[stat.majorityMood].label} Week
              </span>
            )}
          </div>
          <div className="font-bold text-orange-700 mb-2">Week {idx + 1}</div>
          <div className="flex items-end gap-3 w-full justify-center h-24">
            {Object.keys(moodIcons).map((mood) => (
              <div key={mood} className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 sm:w-8 rounded-t-lg ${chartColors[mood] || "bg-gray-200"} border transition-all duration-300`}
                  style={{
                    height: `${(stat.moodCounts[mood] || 0) * 18}px`,
                    minHeight: 6,
                  }}
                  title={moodIcons[mood].label}
                ></div>
                <span className="text-lg mt-1">{moodIcons[mood].icon}</span>
                <span className="text-xs">{stat.moodCounts[mood] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

// Enhanced Pie Chart: 5 boxes for 5 weeks, responsive, modern
const MoodPieChart = ({ weeklyStats }) => {
  // For each week, build pie slices
  return (
    <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
      {Array.from({ length: 5 }).map((_, idx) => {
        const stat = weeklyStats[idx] || { moodCounts: {}, majorityMood: null };
        const total = Object.values(stat.moodCounts).reduce((a, b) => a + b, 0);
        let current = 0;
        const slices = Object.keys(moodIcons).map((mood) => ({
          mood,
          count: stat.moodCounts[mood] || 0,
        }));
        const pieSegments = slices.map(({ mood, count }) => {
          const percent = total ? (count / total) * 100 : 0;
          const start = current;
          const end = current + percent;
          current = end;
          // Use tailwind color hex fallback
          const colorMap = {
            excited: "#fde68a",
            happy: "#6ee7b7",
            neutral: "#fef9c3",
            sad: "#fecaca",
            angry: "#f87171",
          };
          return `${colorMap[mood] || "#ddd"} ${start}% ${end}%`;
        });
        const pieStyle = {
          background: `conic-gradient(${pieSegments.join(", ")})`,
          borderRadius: "50%",
          width: "90px",
          height: "90px",
          margin: "0 auto",
          border: "4px solid #fbbf24",
        };
        return (
          <div
            key={idx}
            className="rounded-xl shadow-lg bg-white border border-orange-200 p-4 flex flex-col items-center min-h-[180px] relative"
          >
            <div className="absolute top-2 right-2 text-xs text-orange-400 font-bold opacity-60">
              {stat.majorityMood && (
                <span className="flex items-center gap-1">
                  {moodIcons[stat.majorityMood].icon}
                  {moodIcons[stat.majorityMood].label} Week
                </span>
              )}
            </div>
            <div className="font-bold text-orange-700 mb-2">Week {idx + 1}</div>
            <div style={pieStyle}></div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {slices.map(({ mood, count }) =>
                count ? (
                  <span key={mood} className="flex items-center gap-1 text-xs">
                    <span
                      className={`w-3 h-3 rounded-full`}
                      style={{
                        background:
                          {
                            excited: "#fde68a",
                            happy: "#6ee7b7",
                            neutral: "#fef9c3",
                            sad: "#fecaca",
                            angry: "#f87171",
                          }[mood] || "#ddd",
                      }}
                    ></span>
                    {moodIcons[mood].icon}
                    {count}
                  </span>
                ) : null
              )}
              {total === 0 && (
                <span className="text-xs text-gray-400">No Journals</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MoodTable = ({ weeklyStats, months, selectedMonth }) => (
  <div className="w-full max-w-2xl overflow-x-auto">
    <table className="min-w-full border border-orange-200 rounded-lg shadow">
      <thead>
        <tr className="bg-orange-100">
          <th className="p-2 text-left">Week</th>
          <th className="p-2 text-left">Dates</th>
          <th className="p-2 text-left">Majority Mood</th>
          <th className="p-2 text-left">Counts</th>
        </tr>
      </thead>
      <tbody>
        {weeklyStats.map((stat, idx) => (
          <tr key={idx} className="border-t">
            <td className="p-2 font-semibold text-orange-700">Week {idx + 1}</td>
            <td className="p-2">
              {stat.week
                .filter((d) => d)
                .map((d) => `${months[selectedMonth].slice(0, 3)} ${d}`)
                .join(", ")}
            </td>
            <td className="p-2">
              {stat.majorityMood ? (
                <span className="flex items-center gap-1">
                  {moodIcons[stat.majorityMood].icon}
                  {moodIcons[stat.majorityMood].label} Week
                </span>
              ) : (
                <span className="text-gray-400 italic">No Journals</span>
              )}
            </td>
            <td className="p-2">
              <div className="flex flex-wrap gap-2">
                {Object.keys(moodIcons).map((mood) =>
                  stat.moodCounts[mood] ? (
                    <span key={mood} className="flex items-center gap-1 text-xs">
                      {moodIcons[mood].icon}
                      {stat.moodCounts[mood]}
                    </span>
                  ) : null
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TrackMood = () => {
  const years = [2024, 2025];
  const [expandedYear, setExpandedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [listWidth, setListWidth] = useState(25); // percent
  const [dragging, setDragging] = useState(false);
  const [mobileStep, setMobileStep] = useState("year"); // "year" | "month" | "calendar"
  const containerRef = useRef();

  // Responsive check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch journals from localStorage
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    async function fetchJournals() {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const userId = user?._id;
      if (!userId) return;
      try {
        const response = await fetch(
          `https://my-journal-cc3m.vercel.app/api/journals/${userId}`
        );
        const data = await response.json();
        setJournals(data);
      } catch (err) {
        setJournals([]);
      }
    }
    fetchJournals();
  }, []);

  // Calendar logic
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayOfWeek = getFirstDayOfWeek(selectedYear, selectedMonth);

  // Build calendar grid
  const calendar = [];
  let week = [];
  for (let i = 0; i < firstDayOfWeek; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendar.push(week);
  }

  // Drag to resize (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      let percent = ((e.clientX - rect.left) / rect.width) * 100;
      if (percent < 15) percent = 15;
      if (percent > 50) percent = 50;
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

  // Mobile navigation handlers
  const handleYearClick = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
    setSelectedYear(year);
    setMobileStep("month");
  };
  const handleMonthClick = (idx, year) => {
    setSelectedMonth(idx);
    setSelectedYear(year);
    setMobileStep("calendar");
  };

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisType, setAnalysisType] = useState("normal"); // "normal" | "chart" | "pie"

  const weeks = getWeeksInMonth(selectedYear, selectedMonth);
  const weeklyStats = useMemo(
    () => getWeeklyMoodStats(weeks, journals, selectedYear, selectedMonth),
    [weeks, journals, selectedYear, selectedMonth]
  );

  // Render
  return (
    <div ref={containerRef} className="min-h-screen flex bg-white/70 relative">
      {/* Left: Year/Month Navigation (Desktop) */}
      {!isMobile && (
        <>
          <div
            style={{ width: `${listWidth}%`, minWidth: 160, maxWidth: 400 }}
            className="border-r border-orange-300 bg-white/80 p-4 md:p-6 transition-all duration-300"
          >
            <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
              <FaRegCalendarAlt /> Mood Calendar
            </h2>
            <ul>
              {years.map((year) => (
                <li key={year} className="mb-2">
                  <button
                    className="flex items-center gap-2 font-semibold text-lg text-orange-800 focus:outline-none"
                    onClick={() =>
                      setExpandedYear(expandedYear === year ? null : year)
                    }
                  >
                    {expandedYear === year ? <FaChevronDown /> : <FaChevronRight />}
                    {year}
                  </button>
                  {expandedYear === year && (
                    <ul className="ml-6 mt-1">
                      {months.map((month, idx) => (
                        <li key={month}>
                          <button
                            className={`py-1 px-2 rounded text-left w-full ${
                              selectedMonth === idx && selectedYear === year
                                ? "bg-orange-200 font-bold"
                                : "hover:bg-orange-50"
                            }`}
                            onClick={() => {
                              setSelectedMonth(idx);
                              setSelectedYear(year);
                            }}
                          >
                            {month}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {/* Mood legend */}
            <div className="mt-8">
              <h4 className="font-semibold text-orange-700 mb-2">Mood Legend</h4>
              <div className="flex flex-col gap-2 text-sm">
                {Object.entries(moodIcons).map(([key, { icon, label }]) => (
                  <span key={key} className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <span>{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Divider/Dragger */}
          <div
            onMouseDown={() => setDragging(true)}
            className="cursor-col-resize w-2 bg-orange-300 hover:bg-orange-500 transition-all duration-200"
            style={{
              zIndex: 10,
              userSelect: "none",
              position: "relative",
            }}
          />
        </>
      )}

      {/* Mobile: Year Selection */}
      {isMobile && mobileStep === "year" && (
        <div className="w-full min-h-screen bg-white/80 p-4 flex flex-col">
          <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <FaRegCalendarAlt /> Mood Calendar
          </h2>
          <ul>
            {years.map((year) => (
              <li key={year} className="mb-2">
                <button
                  className="flex items-center gap-2 font-semibold text-lg text-orange-800 focus:outline-none w-full"
                  onClick={() => handleYearClick(year)}
                >
                  <FaChevronRight />
                  {year}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mobile: Month Selection */}
      {isMobile && mobileStep === "month" && (
        <div className="w-full min-h-screen bg-white/80 p-4 flex flex-col">
          <button
            className="flex items-center gap-2 mb-4 text-orange-700 font-semibold"
            onClick={() => setMobileStep("year")}
          >
            <FaChevronLeft /> Back to Years
          </button>
          <h2 className="text-xl font-bold text-orange-700 mb-4">
            {selectedYear}
          </h2>
          <ul>
            {months.map((month, idx) => (
              <li key={month}>
                <button
                  className={`py-2 px-3 rounded text-left w-full mb-2 ${
                    selectedMonth === idx
                      ? "bg-orange-200 font-bold"
                      : "hover:bg-orange-50"
                  }`}
                  onClick={() => handleMonthClick(idx, selectedYear)}
                >
                  {month}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mobile: Calendar */}
      {isMobile && mobileStep === "calendar" && (
        <div className="w-full min-h-screen bg-white/80 p-4 flex flex-col items-center">
          <button
            className="flex items-center gap-2 mb-4 text-orange-700 font-semibold self-start"
            onClick={() => setMobileStep("month")}
          >
            <FaChevronLeft /> Back to Months
          </button>
          <h3 className="text-2xl font-bold text-orange-700 mb-4">
            {months[selectedMonth]} {selectedYear}
          </h3>
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-7 gap-2 mb-2 text-center font-semibold text-orange-700">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendar.flat().map((day, idx) => {
                if (!day) {
                  return <div key={idx} className="h-16"></div>;
                }
                const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
                  2,
                  "0"
                )}-${String(day).padStart(2, "0")}`;
                const journal = getJournalByDate(journals, dateStr);
                const mood = journal ? journal.mood : null;
                const bgClass = journal ? journal.background : "";

                return (
                  <div
                    key={idx}
                    className={`h-16 flex flex-col items-center justify-center rounded-lg border relative overflow-hidden ${
                      mood
                        ? "border-orange-400"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Pattern background for the date box */}
                    {bgClass && (
                      <div
                        className={`absolute inset-0 w-full h-full ${bgClass}`}
                        style={{ zIndex: 0, opacity: 0.25, borderRadius: "0.5rem" }}
                      />
                    )}
                    <span className="font-bold text-lg relative z-10">{day}</span>
                    {mood ? (
                      <span className="text-2xl mt-1 flex flex-col items-center relative z-10">
                        {moodIcons[mood].icon}
                        <span className="text-xs text-gray-700">
                          {moodIcons[mood].label}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 mt-1 relative z-10">
                        No Journal
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Mood legend */}
            <div className="mt-8">
              <h4 className="font-semibold text-orange-700 mb-2">Mood Legend</h4>
              <div className="flex flex-wrap gap-3 text-sm">
                {Object.entries(moodIcons).map(([key, { icon, label }]) => (
                  <span key={key} className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <span>{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Calendar */}
      {!isMobile && (
        <div className="flex-1 p-4 md:p-8 flex flex-col items-center">
          <h3 className="text-2xl font-bold text-orange-700 mb-4">
            {months[selectedMonth]} {selectedYear}
          </h3>
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-7 gap-2 mb-2 text-center font-semibold text-orange-700">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendar.flat().map((day, idx) => {
                if (!day) {
                  return <div key={idx} className="h-16"></div>;
                }
                const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
                  2,
                  "0"
                )}-${String(day).padStart(2, "0")}`;
                const journal = getJournalByDate(journals, dateStr);
                const mood = journal ? journal.mood : null;
                const bgClass = journal ? journal.background : "";

                return (
                  <div
                    key={idx}
                    className={`h-16 flex flex-col items-center justify-center rounded-lg border relative overflow-hidden ${
                      mood
                        ? "border-orange-400"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Pattern background for the date box */}
                    {bgClass && (
                      <div
                        className={`absolute inset-0 w-full h-full ${bgClass}`}
                        style={{ zIndex: 0, opacity: 0.25, borderRadius: "0.5rem" }}
                      />
                    )}
                    <span className="font-bold text-lg relative z-10">{day}</span>
                    {mood ? (
                      <span className="text-2xl mt-1 flex flex-col items-center relative z-10">
                        {moodIcons[mood].icon}
                        <span className="text-xs text-gray-700">
                          {moodIcons[mood].label}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 mt-1 relative z-10">
                        No Journal
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Analyse Mood Button */}
      {!isMobile && !showAnalysis && (
        <button
          className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded shadow-lg z-20"
          onClick={() => setShowAnalysis(true)}
        >
          Analyse Mood
        </button>
      )}
      {isMobile && !showAnalysis && mobileStep === "calendar" && (
        <button
          className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded shadow-lg z-20"
          onClick={() => setShowAnalysis(true)}
        >
          Analyse Mood
        </button>
      )}

      {/* Mood Analysis Page */}
      {showAnalysis && (
        <div className="fixed inset-0 bg-white/95 z-30 flex flex-col items-center p-4 overflow-auto">
          <button
            className="self-start mb-4 flex items-center gap-2 text-orange-700 font-semibold"
            onClick={() => setShowAnalysis(false)}
          >
            <FaChevronLeft /> Back
          </button>
          <h2 className="text-2xl font-bold text-orange-700 mb-2">
            Mood Analysis: {months[selectedMonth]} {selectedYear}
          </h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded shadow transition font-semibold ${
                analysisType === "normal"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
              onClick={() => setAnalysisType("normal")}
            >
              <FaTable /> Normal
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded shadow transition font-semibold ${
                analysisType === "chart"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
              onClick={() => setAnalysisType("chart")}
            >
              <FaChartBar /> Bar Chart
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded shadow transition font-semibold ${
                analysisType === "pie"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
              onClick={() => setAnalysisType("pie")}
            >
              <FaChartPie /> Pie Chart
            </button>
          </div>
          {analysisType === "normal" && (
            <MoodTable
              weeklyStats={weeklyStats}
              months={months}
              selectedMonth={selectedMonth}
            />
          )}
          {analysisType === "chart" && <MoodChartBar weeklyStats={weeklyStats} />}
          {analysisType === "pie" && <MoodPieChart weeklyStats={weeklyStats} />}
          <div className="mt-8 w-full max-w-2xl">
            <h4 className="font-semibold text-orange-700 mb-2">Mood Legend</h4>
            <div className="flex flex-wrap gap-3 text-sm">
              {Object.entries(moodIcons).map(([key, { icon, label }]) => (
                <span key={key} className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackMood;
