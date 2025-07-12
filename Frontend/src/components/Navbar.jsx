import React from "react";

export default function Navbar() {
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-800">
        <div className="max-w-screen-xl flex items-center justify-end mx-auto p-4">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            VIBE NAVIGATOR
          </span>
        </div>
      </nav>
    </div>
  );
}
