# from selenium import webdriver
# from selenium.webdriver.common.by import By
# import json, time

# city = "Delhi"
# category = "Cafes"

# query = f"{category} in {city}"
# url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"

# driver = webdriver.Chrome()  # make sure chromedriver is in PATH or folder

# print(f"🔍 Opening {url}")
# driver.get(url)
# time.sleep(5)  # wait for page to load

# places = []
# cards = driver.find_elements(By.CLASS_NAME, "Nv2PK")
# print(f"✅ Found {len(cards)} cards")

# for card in cards[:20]:  # limit to top 20
#     try:
#         name = card.find_element(By.CLASS_NAME, "qBF1Pd").text
#         snippet = card.find_element(By.CLASS_NAME, "W4Efsd").text
#         # scrape reviews
#         reviews = []
#         review_elements = driver.find_elements(By.CLASS_NAME, "wiI7pd")
#         for r in review_elements[:3]:  # limit to 3 reviews per place
#             reviews.append(r.text)

#         places.append({
#             "city": city,
#             "category": category,
#             "name": name,
#             "snippet": snippet,
#             "reviews": reviews
#         })
#     except Exception:
#         continue

# driver.quit()

# with open('maps_places.json', 'w', encoding='utf-8') as f:
#     json.dump(places, f, indent=2, ensure_ascii=False)

# print(f"🎉 Scraped {len(places)} places saved to maps_places.json")

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import json, time
from flask import Flask, request, jsonify

# city = "Delhi"
# category = "Cafes"
data = request.get_json()
city = data.get('city')
category = data.get('category')
query = f"{category} in {city}"
url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"

driver = webdriver.Chrome()  # make sure chromedriver.exe is in path
driver.maximize_window()

print(f"🔍 Opening {url}")
driver.get(url)
time.sleep(5)

places = []
cards = driver.find_elements(By.CLASS_NAME, "Nv2PK")
print(f"✅ Found {len(cards)} cards")

for idx, card in enumerate(cards[:10]):  # scrape first 10 places to keep it short
    try:
        name = card.find_element(By.CLASS_NAME, "qBF1Pd").text
        snippet = card.find_element(By.CLASS_NAME, "W4Efsd").text

        # click to open details
        card.click()
        time.sleep(3)  # wait for details panel to open

        # scrape reviews
        reviews = []
        review_elements = driver.find_elements(By.CLASS_NAME, "wiI7pd")
        for r in review_elements[:3]:  # limit to 3 reviews per place
            reviews.append(r.text)

        places.append({
            "city": city,
            "category": category,
            "name": name,
            "snippet": snippet,
            "reviews": reviews
        })

        print(f"✅ Scraped: {name} | Reviews: {len(reviews)}")

        # go back to list
        driver.back()
        time.sleep(3)

        # refresh cards list because DOM might reload
        cards = driver.find_elements(By.CLASS_NAME, "Nv2PK")

    except Exception as e:
        print(f"⚠️ Skipped place {idx+1} due to error:", e)
        continue

driver.quit()

with open('maps_places.json', 'w', encoding='utf-8') as f:
    json.dump(places, f, indent=2, ensure_ascii=False)

print(f"🎉 Scraped {len(places)} places with reviews saved to maps_places.json")
