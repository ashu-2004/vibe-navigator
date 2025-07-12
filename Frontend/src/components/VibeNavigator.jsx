import React, { useState } from "react";

export default function VibeNavigator() {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [suggestedPlaces, setSuggestedPlaces] = useState([]); // for suggestions
  const [answer1, setAnswer1] = useState(""); // for AI answer
  const vibeTags = [
    "aesthetic",
    "quiet",
    "lively",
    "nature-filled",
    "cozy",
    "budget-friendly",
  ];
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSearch = async () => {
    if (!city || !category) {
      alert("Please select both city and category");
      return;
    }

    try {
      // Step 1: call /scrape
      console.log("🔍 Calling /scrape API...");
      const scrapeResponse = await fetch("http://127.0.0.1:5000/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, category }),
      });

      if (!scrapeResponse.ok) {
        const err = await scrapeResponse.json();
        console.error("❌ /scrape error:", err);
        alert("Failed to scrape data");
        return;
      }

      const scrapeData = await scrapeResponse.json();
      console.log("✅ Scrape completed:", scrapeData);

      // Step 2: call /import-data (Node.js)
      console.log("📦 Calling /import-data API...");
      const importResponse = await fetch(
        "http://localhost:8080/api/import-data",
        {
          method: "POST",
        }
      );

      if (!importResponse.ok) {
        const err = await importResponse.json();
        console.error("❌ /import-data error:", err);
        alert("Failed to import data to database");
        return;
      }

      console.log("✅ Import completed");

      // Step 3: call /suggest
      console.log("✨ Calling /suggest API...");
      const suggestResponse = await fetch("http://127.0.0.1:5000/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, category, tags: selectedTags }),
      });

      if (!suggestResponse.ok) {
        const err = await suggestResponse.json();
        console.error("❌ /suggest error:", err);
        alert("Failed to get suggested places");
        return;
      }

      const suggestData = await suggestResponse.json();
      console.log("🎉 Got suggestions:", suggestData);

      // Now set results to state so UI can render them
      setSuggestedPlaces(suggestData.places);
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleQuery = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();

      if (data.answer) {
        // console.log("AI Answer:", data.answer);
        setAnswer1(data.answer);
      } else {
        // console.error("Error from API:", data.error);
        setAnswer1("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      setAnswer1("Error connecting to AI service");
    }
  };

  const toggleTag = async (tag) => {
    const newSelected = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelected);

    // // Immediately call backend
    // try {
    //   const res = await fetch("http://127.0.0.1:5000/suggest", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       city,
    //       category,
    //       tags: newSelected,
    //     }),
    //   });
    //   const data = await res.json();
    //   // console.log("Suggested places:", data.places);
    //   setAnswer(data.places);
    // } catch (error) {
    //   console.error("Error fetching suggestions:", error);
    // }
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-6 text-purple-700">
        ✨ Vibe Navigator ✨
      </h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="Enter City (e.g., Delhi)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 border-2 border-purple-300 rounded-lg p-3 shadow focus:outline-none focus:border-purple-500"
        />

        <input
          type="text"
          placeholder="Enter Category (e.g., Cafes)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 border-2 border-purple-300 rounded-lg p-3 shadow focus:outline-none focus:border-purple-500"
        />

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {vibeTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full border ${
                selectedTags.includes(tag)
                  ? "bg-purple-500 text-white border-purple-500"
                  : "bg-white text-purple-700 border-purple-300"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        <button
          onClick={handleSearch}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg shadow transition"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-6xl mx-auto">
        {suggestedPlaces.map((place, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-purple-700">
                {place.name}
              </h2>
              <span className="text-2xl">{place.emojis}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {place.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-1">{place.summary}</p>
            <p className="text-xs text-gray-500">Source: {place.source}</p>
          </div>
        ))}
      </div>

      <div className="text-lg font-semibold text-purple-700 mb-3 text-center mt-4">
        Ask VibeBot where to chill, explore, or vibe next! 🌿✨
      </div>

      <div className="mb-6 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Ask: e.g., Find a floral-themed cafe in Delhi"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-2 border-green-300 rounded-lg p-3 shadow focus:outline-none focus:border-green-500 mt-4"
        />
        <button
          onClick={handleQuery}
          className="mt-3 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow transition w-full"
        >
          Ask AI
        </button>
      </div>

      {answer1 && (
        <div className="mt-4 bg-white border rounded-lg p-4 shadow mb-4">
          <h3 className="font-semibold text-purple-700 mb-2">AI Answer:</h3>
          <p className="text-gray-700 whitespace-pre-line">{answer1}</p>
        </div>
      )}
      
     


    </div>
  );
}

