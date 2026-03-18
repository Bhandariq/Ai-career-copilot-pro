import os
from openai import OpenAI
from dotenv import load_dotenv

# load env
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_ai_response(message: str):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",   # safe model
            messages=[
                {"role": "system", "content": "You are a helpful interview assistant."},
                {"role": "user", "content": message}
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"