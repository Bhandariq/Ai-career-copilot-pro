import os
from openai import OpenAI
from dotenv import load_dotenv

# Load env (local ke liye useful)
load_dotenv()

# Get API key
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise Exception("❌ OPENAI_API_KEY not set")

# Initialize client
client = OpenAI(api_key=api_key)


def get_ai_response(message: str):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a smart AI interview assistant. Give clear, short and professional answers."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.7,
            max_tokens=500
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("AI ERROR:", str(e))  # server logs me dikhega
        return "⚠️ AI is temporarily unavailable. Try again."