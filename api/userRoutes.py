import logging
from fastapi import APIRouter, HTTPException, Depends
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_404_NOT_FOUND
from pydantic import EmailStr, ValidationError
from dto.userDto import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ErrorResponse, UserProfileUpdateRequest, UserProfileResponse, AppointmentRequest, AppointmentResponse, LogoutRequest
from dto.userDto import MessageResponse
from services.userService import UserService
from dal.userRepository import UserRepository
from exceptions import UserAlreadyExistsException, UserNotFoundException

router = APIRouter()


def get_user_service() -> UserService:
    return UserService(UserRepository())


@router.post("/login", response_model=LoginResponse,
             responses={401: {"model": ErrorResponse}, 400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def login(login_request: LoginRequest, user_service: UserService = Depends(get_user_service)):
    try:
        EmailStr.validate(login_request.email)  # Validate email format
    except ValidationError:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Invalid email format")

    try:
        user = user_service.login_user(login_request.email, login_request.password)
        if user:
            return LoginResponse(message="Login successful", user_id=str(user.id))
        else:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    except UserNotFoundException:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Account does not exist")
    except Exception as e:
        logging.error(f"Login failed: {e}")
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred during login")


@router.post("/register", response_model=RegisterResponse,
             responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def register(register_request: RegisterRequest, user_service: UserService = Depends(get_user_service)):
    logging.info(f"Received registration request for email: {register_request.email}")

    try:
        EmailStr.validate(register_request.email)  # Validate email format
    except ValidationError:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Invalid email format")

    if not register_request.password:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Password field is required")

    if not register_request.confirm_password:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Confirm password field is required")

    try:
        registration_result = user_service.register_user(
            register_request.email,
            register_request.password,
            register_request.confirm_password
        )

        if "error" in registration_result:
            logging.error(f"Registration error for email: {register_request.email}: {registration_result['error']}")
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=registration_result["error"])

        logging.info(f"User registered successfully: {register_request.email}")
        return RegisterResponse(message="Registration successful", user_id=registration_result["user_id"])

    except UserAlreadyExistsException:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Account already exists")
    except Exception as e:
        logging.exception(f"Registration failed for email: {register_request.email}, error: {e}")
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="Registration failed")


@router.put("/profile", response_model=MessageResponse,
            responses={401: {"model": ErrorResponse}, 400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def update_user_profile(
        profile_update_request: UserProfileUpdateRequest,
        user_service: UserService = Depends(get_user_service)
):
    user_email = profile_update_request.userEmail

    if not user_email:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    if not profile_update_request.name:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Name field is required")

    if not profile_update_request.date_of_birth:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Date of birth field is required")

    try:
        current_profile = user_service.get_user_profile(user_email)
        if not current_profile:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="User profile not found")

        if (current_profile.name == profile_update_request.name and
                current_profile.date_of_birth == profile_update_request.date_of_birth and
                current_profile.profile_image == profile_update_request.profile_image):
            return MessageResponse(message="No changes detected")

        result = user_service.update_profile(
            email=user_email,
            name=profile_update_request.name,
            date_of_birth=profile_update_request.date_of_birth,
            profile_image=profile_update_request.profile_image
        )
        if "error" in result:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=result["error"])
        return MessageResponse(message=result["message"])
    except Exception as e:
        logging.error(f"Profile update failed: {e}")
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An error occurred while updating the profile")


@router.get("/profile/{email}", response_model=UserProfileResponse,
            responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def get_user_profile(email: str, user_service: UserService = Depends(get_user_service)):
    try:
        profile = user_service.get_user_profile(email)
        if profile:
            return UserProfileResponse(
                name=profile.name,
                date_of_birth=profile.date_of_birth,
                profile_image=profile.profile_image
            )
        else:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="User profile not found")
    except Exception as e:
        logging.error(f"Error fetching user profile for {email}: {e}")
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An error occurred while fetching the profile")


@router.post("/appointment", response_model=MessageResponse,
             responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def create_appointment(appointment_request: AppointmentRequest,
                             user_service: UserService = Depends(get_user_service)):
    if not appointment_request.email:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Email field is required")

    if not appointment_request.hospital_name:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Hospital name field is required")

    if not appointment_request.hospital_address:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Hospital address field is required")

    if not appointment_request.date:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Date field is required")

    if not appointment_request.time:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Time field is required")

    try:
        result = user_service.save_appointment(
            email=appointment_request.email,
            hospital_name=appointment_request.hospital_name,
            hospital_address=appointment_request.hospital_address,
            date=appointment_request.date,
            time=appointment_request.time
        )
        if "error" in result:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=result["error"])
        return MessageResponse(message=result["message"])
    except Exception as e:
        logging.error(f"Appointment creation failed: {e}")
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An error occurred while creating the appointment")


@router.get("/appointments/{email}", response_model=list[AppointmentResponse],
            responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def get_appointments(email: str, user_service: UserService = Depends(get_user_service)):
    try:
        appointments = user_service.get_user_appointments(email)
        if appointments:
            return [AppointmentResponse(
                hospital_name=appointment.hospital_name,
                hospital_address=appointment.hospital_address,
                date=appointment.date.strftime('%Y-%m-%d'),
                time=appointment.time
            ) for appointment in appointments]
        else:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="No appointments found")
    except Exception as e:
        logging.error(f"Error fetching appointments for {email}: {e}")
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An error occurred while fetching appointments")


@router.post("/logout", response_model=MessageResponse,
             responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def logout(logout_request: LogoutRequest, user_service: UserService = Depends(get_user_service)):
    email = logout_request.email

    if not email:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Email field is required")

    try:
        # Any additional logout logic can be placed here
        return MessageResponse(message="Logout successful")
    except Exception as e:
        logging.error(f"Logout failed: {e}")
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An error occurred during logout")
