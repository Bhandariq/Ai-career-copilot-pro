from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import users
from passlib.context import CryptContext
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    email: str
    password: str

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(user: User):
    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    users.insert_one({
        "email": user.email,
        "password": hash_password(user.password)
    })

    return {"message": "User created successfully"}

@router.post("/login")
def login(user: User):
    db_user = users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Wrong password")

    token = create_token({"email": user.email})

    return {"access_token": token}