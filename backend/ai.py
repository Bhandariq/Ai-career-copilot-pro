import os
from openai import OpenAI
from dotenv import load_dotenv

# ------------------ LOAD ENV ------------------
load_dotenv()

# ------------------ GET API KEY ------------------
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise Exception("❌ OPENAI_API_KEY not set")

# ------------------ INIT CLIENT ------------------
client = OpenAI(api_key=api_key)


# ------------------ AI FUNCTION ------------------
def get_ai_response(message: str):
    try:
        if not message or message.strip() == "":
            return "⚠️ Please enter a valid question."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional AI interview assistant. "
                        "Answer clearly, concisely, and in a structured way. "
                        "Use simple language and examples when needed."
                    )
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.7,
            max_tokens=400
        )

        # ✅ Safe extraction
        if response and response.choices:
            return response.choices[0].message.content.strip()

        return "⚠️ No response from AI."

    except Exception as e:
        print("🔥 AI ERROR:", str(e))  # Render logs me dikhega
        return "⚠️ AI service temporarily unavailable. Please try again."