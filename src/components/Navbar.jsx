import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import dropdownIcon from "../assets/dropdown.png";

function Navbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setProfilePic(user?.profilePic || null);
  }, [location]);

  // Split links for left and right
  const leftLinks = [
    { to: "/", label: "Home" },
    { to: "/journals", label: "Journals" },
    { to: "/track-mood", label: "Track my mood" },
    { to: "/extractaspdf", label: "Extract as PDF" },
  ];
  const rightLinks = [
    { to: "/signin", label: "Sign in" },
    { to: "/signup", label: "Sign up" },
    { to: "/profile", label: "Profile", isProfile: true },
  ];

  return (
    <nav className="flex items-center bg-orange-600 px-6 py-4 relative">
      <img src={logo} alt="Logo" className="h-20 w-20 mr-6" />
      {/* Mobile Title */}
      <div className="sm:hidden flex flex-col flex-1">
        <span className="text-white font-extrabold text-2xl leading-tight">
          MY JOURNAL
        </span>
        <span className="text-orange-100 text-base tracking-wide font-bold">
          A MOOD CALCULATOR
        </span>
      </div>
      {/* Show profile pic on mobile (top right) */}
      <div className="sm:hidden ml-auto flex items-center">
        {profilePic && (
          <img
            src={profilePic}
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-orange-400 object-cover ml-2"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      {/* Desktop Menu */}
      <div className="hidden sm:flex flex-1 items-center">
        <ul className="flex gap-8 list-none m-0 p-0">
          {leftLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `relative pb-1 transition-colors duration-200 ${
                    isActive
                      ? "text-black font-extrabold after:content-[''] after:block after:h-0.5 after:bg-orange-800 after:w-full after:absolute after:bottom-0 after:left-0"
                      : "text-white font-extrabold hover:text-gray-800 after:hidden"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex-1" /> {/* Spacer */}
        <ul className="flex gap-6 list-none m-0 p-0 items-center">
          {rightLinks.map((link) =>
            link.isProfile ? (
              <li key={link.to} className="mr-4 flex items-center">
                {profilePic && (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `relative pb-1 flex items-center transition-colors duration-200 ${
                        isActive
                          ? "text-black font-bold after:content-[''] after:block after:h-0.5 after:bg-orange-800 after:w-full after:absolute after:bottom-0 after:left-0"
                          : "text-white hover:text-gray-800 after:hidden"
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border-2 border-orange-400 object-cover inline-block align-middle ml-2"
                      onClick={() => navigate("/profile")}
                      style={{ cursor: "pointer" }}
                    />
                  </NavLink>
                )}
              </li>
            ) : (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative pb-1 transition-colors duration-200 ${
                      isActive
                        ? "text-black font-bold after:content-[''] after:block after:h-0.5 after:bg-orange-800 after:w-full after:absolute after:bottom-0 after:left-0"
                        : "text-white hover:text-gray-800 after:hidden"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            )
          )}
        </ul>
        <div className="ml-auto flex items-center">
          {!profilePic && (
            <button
              className="bg-orange-600 text-white rounded-full h-10 w-10 flex items-center justify-center"
              onClick={() => navigate("/signup")}
            >
              <span className="font-bold text-xl">+</span>
            </button>
          )}
        </div>
      </div>
      {/* Mobile Dropdown Button */}
      <button
        className="sm:hidden ml-2"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Open menu"
      >
        <img src={dropdownIcon} alt="Menu" className="h-8 w-8" />
      </button>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="absolute top-full left-0 w-full bg-gray-100 flex flex-col gap-2 py-2 px-6 sm:hidden shadow-lg z-10">
          {[...leftLinks, ...rightLinks].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block py-2 transition-colors duration-200 ${
                    isActive
                      ? "text-black font-bold underline"
                      : "text-gray-800 hover:text-orange-800"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.isProfile && profilePic ? (
                  <>
                    <span>{link.label}</span>
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="h-8 w-8 inline-block align-middle ml-2"
                    />
                  </>
                ) : (
                  link.label
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;