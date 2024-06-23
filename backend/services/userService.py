from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR
import logging
from datetime import datetime
from fastapi import HTTPException
from werkzeug.security import generate_password_hash, check_password_hash
from exceptions import UserAlreadyExistsException, UserNotFoundException
from dto.userDto import UserProfileResponse
from models.userModel import User

class UserService:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    def login_user(self, email: str, password: str):
        try:
            user = self.user_repository.find_by_email(email)
            if not user:
                raise UserNotFoundException(f"User not found: {email}")
            if user and check_password_hash(user.password_hash, password):
                return user
            return None
        except UserNotFoundException:
            raise
        except Exception as e:
            logging.error(f"Login error for user {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Service error during login")

    def register_user(self, email: str, password: str, confirm_password: str):
        if password != confirm_password:
            return {"error": "Passwords do not match"}

        try:
            existing_user = self.user_repository.find_by_email(email)
            if existing_user:
                raise UserAlreadyExistsException(f"User already exists: {email}")

            hashed_password = generate_password_hash(password)
            new_user = User(email=email, password_hash=hashed_password).save()
            return {"message": "Registration successful", "user_id": str(new_user.id)}
        except UserAlreadyExistsException:
            raise
        except Exception as e:
            logging.error(f"Registration error for user {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Service error during registration")

    def update_profile(self, email: str, name: str, date_of_birth: datetime, profile_image: str):
        try:
            user = self.user_repository.find_by_email(email)
            if not user:
                return {"error": "User not found"}

            self.user_repository.update_user_profile(email, name, date_of_birth, profile_image)
            return {"message": "Profile updated successfully"}
        except Exception as e:
            logging.error(f"Profile update error for user {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Service error during profile update")

    def get_user_profile(self, email: str):
        try:
            user_profile = self.user_repository.get_user_profile(email)
            if user_profile:
                return UserProfileResponse(
                    name=user_profile.name,
                    date_of_birth=user_profile.date_of_birth,
                    profile_image=user_profile.profile_image
                )
            else:
                return None
        except Exception as e:
            logging.error(f"Error fetching profile for user {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Service error during profile fetch")

    def save_appointment(self, email: str, hospital_name: str, hospital_address: str, date: str, time: str):
        try:
            user = self.user_repository.find_by_email(email)
            if not user:
                return {"error": "User not found"}

            appointment_date = datetime.strptime(date, '%Y-%m-%d')
            existing_appointment = self.user_repository.find_appointment_by_date_and_time(appointment_date, time)
            if existing_appointment:
                return {"error": "An appointment already exists for this date and time"}

            appointment = self.user_repository.save_appointment(user, hospital_name, hospital_address, appointment_date, time)
            return {"message": "Appointment saved successfully", "appointment_id": str(appointment.id)}
        except Exception as e:
            logging.error(f"Error saving appointment for user {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Service error during appointment save")

    def get_user_appointments(self, email: str):
        try:
            user = self.user_repository.find_by_email(email)
            if not user:
                return {"error": "User not found"}

            appointments = self.user_repository.get_user_appointments(user)
            return appointments
        except Exception as e:
            logging.error(f"Error fetching appointments for user {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Service error during appointments fetch")
