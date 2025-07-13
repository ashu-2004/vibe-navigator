import React, { useState } from "react";

export default function VibeSearch() {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const vibeTags = [
    "aesthetic", "quiet", "lively", "nature-filled", "cozy", "budget-friendly"
  ];

  // const handleSearch = async () => {
  //   if (!city || !category) {
  //     alert("Please select both city and category");
  //     return;
  //   }
  //   try {
  //     await fetch("https://vibe-navigator-1.onrender.com/scrape", {
  //       method: "POST", headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ city, category })
  //     });
  //     await fetch("https://vibe-navigator-1.onrender.com/api/import-data", { method: "POST" });
  //     const suggestRes = await fetch("https://vibe-navigator-1.onrender.com/suggest", {
  //       method: "POST", headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ city, category, tags: selectedTags })
  //     });
  //     const data = await suggestRes.json();
  //     setSuggestedPlaces(data.places);
  //   } catch (e) {
  //     console.error(e);
  //     alert("Something went wrong.");
  //   }
  // };
const handleSearch = async () => {
  if (!city || !category) {
    alert("Please select both city and category");
    return;
  }
  try {
    const res = await fetch("https://vibe-navigator-1.onrender.com/vibes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, category })
    });
    const data = await res.json();
console.log("Response data:", data);

    if (data.vibes) {
      // Update your state to display these vibe results
      setSuggestedPlaces(data.vibes);
    } else {
      alert(data.message || "No places found.");
    }
  } catch (e) {
    console.error(e);
    alert("Something went wrong.");
  }
};

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className=" flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-purple-600 rounded-3xl p-8 shadow-2xl w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-200">
          Vibe Navigator
        </h1>

        <div className="flex flex-col md:flex-row gap-3 mb-6 justify-center">
          <input
            type="text"
            placeholder="Enter City (e.g., Delhi)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 bg-gray-800 text-white border border-gray-500 rounded-lg p-3 shadow focus:outline-none focus:border-purple-300"
          />
          <input
            type="text"
            placeholder="Enter Category (e.g., Cafes)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-gray-800 text-white border border-gray-500 rounded-lg p-3 shadow focus:outline-none focus:border-purple-300"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {vibeTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded border text-sm transition  ${
                selectedTags.includes(tag)
                  ? "bg-purple-500 text-white border-gray-500"
                  : "bg-gray-800 text-purple-300 border-gray-500 hover:bg-purple-700 hover:text-white"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleSearch}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {suggestedPlaces.map((place, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-purple-500 rounded-3xl p-6 shadow-xl hover:scale-105 hover:shadow-purple-500/40 transition-transform duration-300 w-full max-w-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-300">{place.name}</h2>
                <span className="text-3xl">{place.emojis}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {place.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-purple-700 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4">{place.summary}</p>
              <p className="text-xs text-purple-400">Source: {place.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
