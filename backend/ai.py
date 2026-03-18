import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise Exception("❌ OPENAI_API_KEY not set")

client = OpenAI(api_key=api_key)

def get_ai_response(message: str):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # ✅ stable + cheap
            messages=[
                {"role": "system", "content": "You are a helpful interview assistant."},
                {"role": "user", "content": message}
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"