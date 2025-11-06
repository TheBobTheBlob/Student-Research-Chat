from pydantic import BaseModel, field_validator, EmailStr
import enum


class UserType(enum.Enum):
    student = "student"
    professor = "professor"


class ChatRole(enum.Enum):
    member = "member"
    admin = "admin"


class CreateUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    user_type: UserType

    @field_validator("user_type", mode="before")
    def lowercase_user_type(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v


class UserRow(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    user_type: UserType


class LoginRequest(BaseModel):
    email: str
    password: str
