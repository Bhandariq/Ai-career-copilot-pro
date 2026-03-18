from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import jwt
import bcrypt

# ------------------ LOAD ENV ------------------
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ✅ SAFETY CHECK (IMPORTANT)
if not MONGO_URL:
    raise Exception("❌ MONGO_URL not set")

if not JWT_SECRET:
    raise Exception("❌ JWT_SECRET not set")

if not OPENAI_API_KEY:
    raise Exception("❌ OPENAI_API_KEY not set")

# ------------------ DB ------------------
try:
    client = MongoClient(MONGO_URL)
    db = client["career_ai"]
except Exception as e:
    raise Exception(f"❌ MongoDB connection failed: {str(e)}")

users = db["users"]
history = db["history"]

# ------------------ IMPORT AI ------------------
try:
    from ai import get_ai_response
except Exception as e:
    raise Exception(f"❌ AI import failed: {str(e)}")

# ------------------ APP ------------------
app = FastAPI()

# ------------------ SECURITY ------------------
security = HTTPBearer()

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ MODELS ------------------
class User(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str

# ------------------ JWT ------------------
def create_token(data: dict):
    return jwt.encode(data, JWT_SECRET, algorithm="HS256")

def verify_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except:
        raise HTTPException(status_code=401, detail="Invalid Token")

# ------------------ AUTH ------------------
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    return verify_token(token)

# ------------------ ROUTES ------------------

@app.get("/")
def home():
    return {"message": "AI Career Copilot Running 🚀"}


@app.post("/signup")
def signup(user: User):
    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())

    users.insert_one({
        "email": user.email,
        "password": hashed
    })

    return {"message": "User created successfully"}


@app.post("/login")
def login(user: User):
    db_user = users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not bcrypt.checkpw(user.password.encode(), db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_token({"email": user.email})
    return {"access_token": token}


@app.post("/chat")
def chat(data: ChatRequest, user=Depends(get_current_user)):
    
    message = data.message

    try:
        response = get_ai_response(message)
    except Exception as e:
        return {"response": f"Error: {str(e)}"}

    if not response.startswith("Error"):
        history.insert_one({
            "email": user["email"],
            "question": message,
            "answer": response
        })

    return {"response": response}


@app.get("/history")
def get_history(user=Depends(get_current_user)):
    data = list(history.find({"email": user["email"]}, {"_id": 0}))
    return data


@app.post("/analyze")
def analyze(data: dict):
    text = data.get("text", "")

    if "spam" in text.lower():
        return {"result": "Spam"}

    return {"result": "Not Spam"}