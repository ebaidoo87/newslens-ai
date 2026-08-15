from pydantic import BaseModel, EmailStr, ConfigDict

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from pydantic import BaseModel, Field

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    role: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class UserUpdate(BaseModel):
    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    email: EmailStr | None = None

    current_password: str


class PasswordChange(BaseModel):
    current_password: str

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )

    confirm_new_password: str