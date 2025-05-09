# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from googlesearch import search
# import requests
# from bs4 import BeautifulSoup

# app = Flask(__name__)
# CORS(app)

# trusted_sources = [
#     "bbc.com", "reuters.com", "ndtv.com", "cnn.com",
#     "thehindu.com", "indiatoday.in", "aljazeera.com", "nytimes.com"
# ]

# def is_from_trusted_source(url):
#     return any(source in url for source in trusted_sources)

# def fetch_snippet(url):
#     try:
#         headers = {'User-Agent': 'Mozilla/5.0'}
#         res = requests.get(url, headers=headers, timeout=5)
#         soup = BeautifulSoup(res.text, 'html.parser')
#         return soup.title.text if soup.title else ''
#     except:
#         return ''

# def fact_check(statement, max_results=5):
#     results = list(search(statement, num_results=max_results))
#     trusted_hits = 0

#     for url in results:
#         if is_from_trusted_source(url):
#             title = fetch_snippet(url)
#             if statement.lower().split()[0] in title.lower():
#                 trusted_hits += 1

#     if trusted_hits >= 2:
#         return "✅ Real – Found in multiple trusted sources."
#     elif trusted_hits == 1:
#         return "❓ Uncertain – Found in only one trusted source."
#     else:
#         return "❌ Fake or Unconfirmed – No major sources found."

# @app.route("/api/fact-check", methods=["POST"])
# def api_fact_check():
#     data = request.get_json()
#     statement = data.get("text", "")

#     if not statement:
#         return jsonify({"error": "No text provided"}), 400

#     result = fact_check(statement)
#     return jsonify({"result": result})

# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
from googlesearch import search
import requests
from bs4 import BeautifulSoup
import time
from requests.exceptions import HTTPError

app = Flask(__name__)
CORS(app)

trusted_sources = [
    "bbc.com", "reuters.com", "ndtv.com", "cnn.com",
    "thehindu.com", "indiatoday.in", "aljazeera.com", "nytimes.com"
]

def is_from_trusted_source(url):
    return any(source in url for source in trusted_sources)

def fetch_snippet(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        res = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(res.text, 'html.parser')
        return soup.title.text if soup.title else ''
    except Exception as e:
        print(f"Error fetching snippet from {url}: {e}")
        return ''

def fact_check(statement, max_results=5):
    results = []
    retries = 5  # Number of retries before giving up
    delay = 5  # Delay in seconds between retries

    for attempt in range(retries):
        try:
            results = list(search(statement, num_results=max_results))
            break  # If search is successful, break out of the loop
        except HTTPError as e:
            if e.response.status_code == 429:
                print(f"Too many requests, retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                print(f"Error while performing search: {e}")
                return "❌ Error – Unable to perform search."
        except Exception as e:
            print(f"Unexpected error: {e}")
            return "❌ Error – An unexpected error occurred."

    trusted_hits = 0
    for url in results:
        if is_from_trusted_source(url):
            title = fetch_snippet(url)
            if statement.lower().split()[0] in title.lower():
                trusted_hits += 1

    if trusted_hits >= 2:
        return "✅ Real – Found in multiple trusted sources."
    elif trusted_hits == 1:
        return "❓ Uncertain – Found in only one trusted source."
    else:
        return "❌ Fake or Unconfirmed – No major sources found."

@app.route("/api/fact-check", methods=["POST"])
def api_fact_check():
    data = request.get_json()
    statement = data.get("text", "")

    if not statement:
        return jsonify({"error": "No text provided"}), 400

    try:
        result = fact_check(statement)
        return jsonify({"result": result}), 200
    except Exception as e:
        print(f"Error in fact-checking: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
