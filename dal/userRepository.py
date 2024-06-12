import logging
from datetime import datetime
from fastapi import HTTPException
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from models.userModel import UserProfile, User, Appointment

class UserRepository:
    def find_by_email(self, email: str):
        try:
            logging.info(f"Querying user by email: {email}")
            return User.objects(email=email).first()
        except Exception as e:
            logging.error(f"Error querying user by email {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Database query error")

    def update_user_profile(self, email: str, name: str, date_of_birth: datetime, profile_image: str):
        try:
            logging.info(f"Updating profile for user: {email}")
            user_profile = UserProfile.objects(email=email).first()
            if user_profile:
                user_profile.update(set__name=name, set__date_of_birth=date_of_birth, set__profile_image=profile_image)
            else:
                UserProfile(email=email, name=name, date_of_birth=date_of_birth, profile_image=profile_image).save()
        except Exception as e:
            logging.error(f"Error updating profile for user {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Database update error")

    def save_appointment(self, user: User, hospital_name: str, hospital_address: str, date: datetime, time: str):
        try:
            appointment = Appointment(
                user=user,
                hospital_name=hospital_name,
                hospital_address=hospital_address,
                date=date,
                time=time
            ).save()
            return appointment
        except Exception as e:
            logging.error(f"Error saving appointment for user {user.email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Database save error")

    def get_user_appointments(self, user: User):
        try:
            return Appointment.objects(user=user).all()
        except Exception as e:
            logging.error(f"Error fetching appointments for user {user.email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Database query error")

    def find_appointment(self, user: User, date: datetime, time: str):
        try:
            return Appointment.objects(user=user, date=date, time=time).first()
        except Exception as e:
            logging.error(f"Error finding appointment for user {user.email} on {date} at {time}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Database query error")

    def get_user_profile(self, email: str):
        try:
            logging.info(f"Querying user profile by email: {email}")
            return UserProfile.objects(email=email).first()
        except Exception as e:
            logging.error(f"Error querying user profile by email {email}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Database query error")

    def find_appointment_by_date_and_time(self, date: datetime, time: str):
        try:
            return Appointment.objects(date=date, time=time).first()
        except Exception as e:
            logging.error(f"Error finding appointment on {date} at {time}: {e}")
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Database query error")
