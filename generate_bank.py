import os
import json
import urllib.request
import urllib.error

# Usage: 
# GEMINI_API_KEY="your_key" python generate_bank.py

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Please set the GEMINI_API_KEY environment variable.")
    exit(1)

URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={API_KEY}"

PROMPT = """
You are an expert Instructional Designer and AI Subject Matter Expert.
Generate 50 highly accurate, unique, and challenging questions about AI Foundations.
The topics should cover: AI literacy, prompt engineering, LLMs vs SLMs, context windows, tokens, RAG, agents, tool calling, and AI ethics/bias.
Do not repeat questions. Ensure all options are plausible but only one is correct (or multiple if type is multiple-select).

Format the output strictly as a JSON array of objects matching this TypeScript interface:
{
  "id": "gen-001",
  "moduleId": "1", // string from "0" to "7"
  "type": "multiple-choice", // or "multiple-select", "fill-blank", "match-pairs"
  "difficulty": "foundational", // or "intermediate", "advanced"
  "prompt": "The question text",
  "explanation": "Why the answer is correct",
  "options": [
    { "id": "a", "text": "Option A", "correct": false },
    ...
  ]
}

Return ONLY the raw JSON array.
"""

def generate_batch(batch_num):
    print(f"Generating batch {batch_num}/10 (50 questions)...")
    data = {
        "contents": [{"parts": [{"text": PROMPT}]}],
        "generationConfig": {
            "temperature": 0.7,
            "responseMimeType": "application/json"
        }
    }
    
    req = urllib.request.Request(URL, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as response:
            res_body = json.loads(response.read())
            text = res_body["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
    except Exception as e:
        print(f"Error generating batch {batch_num}: {e}")
        return []

all_questions = []
# Generate 10 batches of 50 questions = 500 questions
for i in range(1, 11):
    qs = generate_batch(i)
    for q in qs:
        # ensure unique IDs
        q["id"] = f"auto-gen-{len(all_questions) + 1}"
    all_questions.extend(qs)
    print(f"Total accumulated: {len(all_questions)}")

with open("generated_questions.json", "w") as f:
    json.dump(all_questions, f, indent=2)

print("\nDone! Saved to generated_questions.json")
print("You can copy these objects into src/lib/question-bank.ts")
