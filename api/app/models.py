from pydantic import BaseModel, field_validator
from db.tables import UserType


class CreateUserRequest(BaseModel):
    email: str
    password: str
    user_type: UserType

    @field_validator("user_type", mode="before")
    def lowercase_user_type(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v
