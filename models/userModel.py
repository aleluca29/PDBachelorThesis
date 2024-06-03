from mongoengine import Document, EmailField, StringField, DateTimeField, ReferenceField, ListField
from datetime import date

class User(Document):
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)

class UserProfile(Document):
    email = EmailField(required=True, unique=True)
    name = StringField(required=True)
    date_of_birth = DateTimeField(required=True)  # Changed from 'str' to 'DateTimeField'
    profile_image = StringField(required=False)  # Field for profile image

class Appointment(Document):
    user = ReferenceField(User, required=True)
    hospital_name = StringField(required=True)
    hospital_address = StringField(required=True)
    date = DateTimeField(required=True)
    time = StringField(required=True)
