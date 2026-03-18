from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import jwt
import bcrypt

# ---------------- ENV ----------------
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
JWT_SECRET = os.getenv("JWT_SECRET")

if not MONGO_URL:
    raise Exception("❌ MONGO_URL not set")

if not JWT_SECRET:
    raise Exception("❌ JWT_SECRET not set")

# ---------------- DB ----------------
client = MongoClient(MONGO_URL)
db = client["career_ai"]

users = db["users"]
history = db["history"]

# ---------------- APP ----------------
app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SECURITY ----------------
security = HTTPBearer()

def create_token(data: dict):
    return jwt.encode(data, JWT_SECRET, algorithm="HS256")

def verify_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return verify_token(credentials.credentials)

# ---------------- MODELS ----------------
class User(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str

# ---------------- ROUTES ----------------

@app.get("/")
def home():
    return {"message": "AI Career Copilot Running 🚀"}

# ✅ FIXED SIGNUP
@app.post("/signup")
def signup(user: User):
    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    # 🔥 FIX: store as string
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()

    users.insert_one({
        "email": user.email,
        "password": hashed
    })

    return {"message": "User created successfully"}

# ✅ FIXED LOGIN
@app.post("/login")
def login(user: User):
    db_user = users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not bcrypt.checkpw(
        user.password.encode(),
        db_user["password"].encode()
    ):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_token({"email": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# ---------------- CHAT ----------------
@app.post("/chat")
def chat(data: ChatRequest, user=Depends(get_current_user)):
    message = data.message

    response = f"AI Response for: {message}"

    history.insert_one({
        "email": user["email"],
        "question": message,
        "answer": response
    })

    return {"response": response}

# ---------------- HISTORY ----------------
@app.get("/history")
def get_history(user=Depends(get_current_user)):
    data = list(history.find({"email": user["email"]}, {"_id": 0}))
    return data