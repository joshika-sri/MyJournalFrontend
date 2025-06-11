import React from "react";
import { FaBookOpen, FaSmile, FaFilePdf, FaLock, FaSave, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

function FeatureSection() {
  const features = [
    {
      icon: <FaBookOpen className="text-4xl text-orange-600 mb-4" />,
      title: "Start Writing Journals",
      desc: "Capture your thoughts and memories in a secure, private journal.",
      route: "/journals",
      button: "Start Journaling",
    },
    {
      icon: <FaSmile className="text-4xl text-pink-500 mb-4" />,
      title: "Track My Mood",
      desc: "Monitor your mood over time and gain insights into your well-being.",
      route: "/track-mood",
      button: "Track Mood",
    },
    {
      icon: <FaFilePdf className="text-4xl text-blue-600 mb-4" />,
      title: "Export as PDF",
      desc: "Download your journal entries as a PDF to keep or share.",
      route: "/extractaspdf",
      button: "Export PDF",
    },
    {
      icon: <FaLock className="text-4xl text-gray-700 mb-4" />,
      title: "Privacy",
      desc: "Your journals are private and only accessible by you.",
    },
    {
      icon: <FaSave className="text-4xl text-green-600 mb-4" />,
      title: "Save As You Go",
      desc: "Your entries are automatically saved as you write.",
    },
    {
      icon: <FaEdit className="text-4xl text-purple-600 mb-4" />,
      title: "Edit Your Moods Anytime",
      desc: "Update and edit your mood entries whenever you want.",
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center text-orange-700 mb-10">
          Even More Powerful Journaling Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-100 rounded-lg shadow-md p-8 flex-1 text-center max-w-xs mx-auto"
            >
              {feature.icon}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700 mb-4">{feature.desc}</p>
              {feature.route && (
                <Link
                  to={feature.route}
                  className="inline-block mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded transition"
                >
                  {feature.button}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;