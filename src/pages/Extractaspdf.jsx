import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ExtractAsPDF() {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    async function fetchJournals() {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const userId = user?._id;
      if (!userId) return;
      try {
        const response = await fetch(`https://my-journal-cc3m.vercel.app/api/journals/${userId}`);
        const data = await response.json();
        setJournals(data);
      } catch (err) {
        setJournals([]);
      }
    }
    fetchJournals();
  }, []);

  const handleDownloadPDF = (journal) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(journal.title || "Untitled Journal", 14, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${journal.date} (${journal.day}, ${journal.year})`, 14, 32);

    if (journal.mood) {
      doc.text(
        `Mood: ${journal.mood.charAt(0).toUpperCase() + journal.mood.slice(1)}`,
        14,
        40
      );
    }

    doc.setFontSize(14);
    doc.text("Story:", 14, 52);
    doc.setFontSize(12);
    doc.text(journal.story || "", 14, 62, { maxWidth: 180 });

    doc.save(`${journal.title || "journal"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-white/80 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-orange-700 mb-8">Extract Journal as PDF</h2>
      <div className="w-full max-w-2xl">
        {journals.length === 0 ? (
          <div className="text-gray-500 italic">No journals found.</div>
        ) : (
          <ul className="space-y-4">
            {journals.map((journal, idx) => (
              <li
                key={idx}
                className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow"
              >
                <div>
                  <div className="font-bold text-lg text-orange-800">
                    {journal.title || "Untitled"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {journal.date} ({journal.day}, {journal.year})
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Mood:{" "}
                    {journal.mood
                      ? journal.mood.charAt(0).toUpperCase() + journal.mood.slice(1)
                      : "Not set"}
                  </div>
                </div>
                <button
                  className="mt-4 sm:mt-0 sm:ml-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition"
                  onClick={() => handleDownloadPDF(journal)}
                >
                  Download as PDF
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ExtractAsPDF;
