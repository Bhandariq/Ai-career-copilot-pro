from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise Exception("❌ MONGO_URL not set")

try:
    client = MongoClient(MONGO_URL)
    db = client["career_ai"]
except Exception as e:
    raise Exception(f"❌ MongoDB connection failed: {str(e)}")

users = db["users"]
history = db["history"]