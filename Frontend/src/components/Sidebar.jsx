import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button always visible in top-left corner */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="fixed top-4 left-4 z-50 inline-flex justify-center items-center p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-900 focus:outline-none "
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-full transition-transform duration-300 
          bg-white border-e border-gray-200 dark:bg-gray-800 dark:border-neutral-700
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          
        `}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full mt-6">
          <header className="flex items-center justify-between p-4">
            <span className="font-semibold text-xl text-black dark:text-white mt-6">
              VIBE NAVIGATOR
            </span>
            <div className="lg:hidden"></div>
          </header>

          <nav className="flex-1 overflow-y-auto px-2">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/ask-ai"
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="9" cy="7" r="4" />
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                    <path d="M22 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  Ask AI
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
