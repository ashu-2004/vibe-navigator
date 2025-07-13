import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import pymongo
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.common.by import By
import json, time

# Load .env
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create Flask app
app = Flask(__name__)
CORS(app)  # Allow requests from frontend
# Connect MongoDB
client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = client["test"]           # change
places_collection = db["places"]      # change if your collection name is different
# Simple health check route
@app.route('/')
def home():
    return 'Vibe Navigator AI Backend is running!'

# AI endpoint
@app.route('/ask-ai', methods=['POST'])
def ask_ai():
    try:
        data = request.get_json()
        question = data.get('question')

        if not question:
            return jsonify({'error': 'No question provided'}), 400

        # Add prompt to keep AI on topic
        prompt = f"""
        You are VibeBot, a friendly local guide and vibe expert.
        Your job is to help users discover public spots (cafes, parks, gyms, museums, etc.) in their city by telling them the vibe of each location in a fun, playful, storytelling way.
        Recommend spots based on mood tags like 'cozy', 'aesthetic', 'lively', 'quiet' and always ground your answer in real user reviews.
        Do not answer questions unrelated to places, vibes, or recommendations in the city.
        If someone asks about unrelated topics, politely decline and say: “I can only help you explore local vibes and spots!”

        Your tone should be friendly, casual, and sound like a local friend.

        User's question: {question}
        """

        # Call Gemini
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)

        return jsonify({'answer': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

import re
import json
@app.route('/suggest', methods=['POST'])
def suggest_places():
    try:
        data = request.get_json()
        city = data.get('city')
        category = data.get('category')
        tags = data.get('tags', [])

        matching_places = list(places_collection.find({
            "city": city,
            "category": category
        }))

        results = []
        model = genai.GenerativeModel('gemini-1.5-flash')

        for place in matching_places:
            place_name = place.get('name')
            reviews = place.get('reviews', [])
            reviews_text = "\n".join(reviews)

            prompt = f"""
You are VibeBot, a local vibe expert.
Summarize the vibe of this place based on real reviews.
- Place name: '{place_name}'
- City: {city}
- Category: {category}
- User vibe tags: {', '.join(tags)}

Real user reviews:
{reviews_text}

Respond ONLY in JSON (no markdown, no text before/after). Format:
{{
  "summary": "short vibe summary",
  "emojis": "🌿☕✨",
  "tags": ["quiet", "aesthetic", "budget-friendly"]
}}
"""

            response = model.generate_content(prompt)
            response_text = response.text.strip()

            # Remove ```json code fences if present
            if response_text.startswith("```"):
                response_text = re.sub(r"^```.*?\n", "", response_text, flags=re.DOTALL)
                response_text = re.sub(r"\n```$", "", response_text, flags=re.DOTALL)
                response_text = response_text.strip()

            try:
                parsed = json.loads(response_text)
                result_card = {
                    "name": place_name,
                    "category": category,
                    "summary": parsed.get("summary"),
                    "emojis": parsed.get("emojis"),
                    "tags": parsed.get("tags"),
                    "source": place.get('source', 'TripAdvisor')
                }
            except Exception as parse_err:
                print("⚠️ Failed to parse JSON, fallback:", parse_err)
                result_card = {
                    "name": place_name,
                    "category": category,
                    "summary": response_text,  # raw text fallback
                    "emojis": "",
                    "tags": [],
                    "source": place.get('source', 'TripAdvisor')
                }

            results.append(result_card)

        return jsonify({"places": results})

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({'error': str(e)}), 500



@app.route('/scrape', methods=['POST'])
def scrape_places():
    data = request.get_json()
    city = data.get('city')
    category = data.get('category')

    if not city or not category:
        return jsonify({'error': 'Missing city or category'}), 400

    query = f"{category} in {city}"
    url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"

    driver = webdriver.Chrome()  # make sure chromedriver is in PATH
    driver.maximize_window()
    print(f"🔍 Opening {url}")
    driver.get(url)
    time.sleep(5)

    places = []
    cards = driver.find_elements(By.CLASS_NAME, "Nv2PK")
    print(f"✅ Found {len(cards)} cards")

    for idx, card in enumerate(cards[:10]):  # scrape first 10
        try:
            name = card.find_element(By.CLASS_NAME, "qBF1Pd").text
            snippet = card.find_element(By.CLASS_NAME, "W4Efsd").text

            card.click()
            time.sleep(3)

            reviews = []
            review_elements = driver.find_elements(By.CLASS_NAME, "wiI7pd")
            for r in review_elements[:3]:
                reviews.append(r.text)

            places.append({
                "city": city,
                "category": category,
                "name": name,
                "source": "Google Maps",
                "reviews": reviews
            })

            print(f"✅ Scraped: {name}")

            driver.back()
            time.sleep(3)
            cards = driver.find_elements(By.CLASS_NAME, "Nv2PK")

        except Exception as e:
            print(f"⚠️ Skipped place {idx+1} due to error: {e}")
            continue

    driver.quit()

    # optionally save to file
    with open('maps_places.json', 'w', encoding='utf-8') as f:
        json.dump(places, f, indent=2, ensure_ascii=False)

    print(f"🎉 Scraped {len(places)} places saved to maps_places.json")

    return jsonify({'places': places})

from static_places import static_places


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
