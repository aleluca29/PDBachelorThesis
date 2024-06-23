from mongoengine import Document, EmailField, StringField, DateTimeField, ReferenceField, DateField



class User(Document):
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)


class UserProfile(Document):
    email = EmailField(required=True, unique=True)
    name = StringField(required=True)
    date_of_birth = DateField(required=True)
    profile_image = StringField(required=False)


class Appointment(Document):
    user = ReferenceField(User, required=True)
    hospital_name = StringField(required=True)
    hospital_address = StringField(required=True)
    date = DateTimeField(required=True)
    time = StringField(required=True)




