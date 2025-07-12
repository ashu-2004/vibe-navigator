import React, { useState } from "react";

export default function VibeBot() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const handleQuery = async () => {
    try {
      const res = await fetch("https://vibe-navigator-1.onrender.com/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query })
      });
      const data = await res.json();
      setAnswer(data.answer || "Error: " + data.error);
    } catch (error) {
      console.error("Error:", error);
      setAnswer("Error connecting to AI service");
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-8 bg-gray-900">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-purple-600 rounded-3xl p-8 shadow-2xl w-full max-w-3xl">
        <div className="text-xl font-semibold text-center text-gray-200 mb-6">
          ASK VIBEBOT WHERE TO CHILL, EXPLORE, OR VIBE NEXT!
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Ask: e.g., Find a floral-themed cafe in Delhi"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-500 rounded-lg p-3 shadow focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={handleQuery}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            Ask AI
          </button>
        </div>
        {answer && (
          <div className="mt-6 bg-gray-800 border border-purple-500 rounded-lg p-4 shadow">
            <h3 className="font-semibold text-purple-300 mb-2">AI Answer:</h3>
            <p className="text-gray-200 whitespace-pre-line">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
