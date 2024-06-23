from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str

class RegisterResponse(BaseModel):
    message: str
    user_id: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    message: str
    user_id: str

class UserProfileUpdateRequest(BaseModel):
    userEmail: EmailStr = Field(..., example="user@example.com")
    name: str = Field(..., min_length=1)
    date_of_birth: Optional[date]
    profile_image: Optional[str] = None

class UserProfileResponse(BaseModel):
    name: str
    date_of_birth: Optional[date]
    profile_image: Optional[str] = None

class MessageResponse(BaseModel):
    message: str

class ErrorResponse(BaseModel):
    error: str

class AppointmentRequest(BaseModel):
    email: EmailStr
    hospital_name: str
    hospital_address: str
    date: str
    time: str

class AppointmentResponse(BaseModel):
    hospital_name: str
    hospital_address: str
    date: str
    time: str

class LogoutRequest(BaseModel):
    email: EmailStr
