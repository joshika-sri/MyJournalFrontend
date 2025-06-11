import React from "react";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import founderImg from "../assets/joshika.jpg"; // Place your picture as joshika.jpg in src/assets

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-700 via-orange-800 to-orange-900 text-white py-10 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* About/Founder Section */}
        <div className="mb-8 md:mb-0 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="uppercase tracking-widest text-xs font-bold text-orange-300 mb-2">
            MEET THE FOUNDER
          </span>
          <div className="relative mb-3">
            <img
              src={founderImg}
              alt="Joshika Sri"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {/* Ethnic accent ring */}
            <span className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-tr from-pink-400 via-yellow-300 to-orange-400 rounded-full opacity-80 blur-sm"></span>
          </div>
          <h3 className="text-2xl font-extrabold tracking-wide mb-1 font-serif">Joshika Sri</h3>
          <span className="inline-block bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-xs font-semibold mb-2 tracking-wider shadow">
            Founder & Visionary
          </span>
          <p className="text-base font-medium italic max-w-xs mb-2">
            “My Journal: Where Your Privacy Matters
A secure web app that keeps your thoughts safe while analyzing your mood in real-time, helping you understand your emotions as you write.
”
          </p>
          <div className="flex gap-2 mt-2">
            <span className="inline-block bg-orange-300 text-orange-900 px-2 py-0.5 rounded text-xs font-bold">#Journaling</span>
          </div>
        </div>
        {/* Social Section */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <span className="font-semibold text-lg mb-1">Follow us</span>
          <div className="flex gap-6">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-300 transition"
              aria-label="Instagram"
            >
              <FaInstagram size={28} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition"
              aria-label="Twitter"
            >
              <FaTwitter size={28} />
            </a>
          </div>
          <span className="text-xs text-orange-200 mt-2">© {new Date().getFullYear()} My Journal</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;