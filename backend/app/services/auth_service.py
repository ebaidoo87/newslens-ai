from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    UserLogin,
    UserRegister,
)


class AuthService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = UserRepository()

    def register(
        self,
        user_data: UserRegister,
    ):
        existing_email = self.repository.get_by_email(
            self.db,
            user_data.email,
        )

        if existing_email:
            raise ValueError("Email already exists")

        existing_username = self.repository.get_by_username(
            self.db,
            user_data.username,
        )

        if existing_username:
            raise ValueError("Username already exists")

        user = User(
            email=user_data.email,
            username=user_data.username,
            password_hash=hash_password(
                user_data.password
            ),
        )

        return self.repository.create(
            self.db,
            user,
        )

    def login(
        self,
        credentials: UserLogin,
    ):
        user = self.repository.get_by_email(
            self.db,
            credentials.email,
        )

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(
            credentials.password,
            user.password_hash,
        ):
            raise ValueError("Invalid email or password")

        token = create_access_token(
            {
                "sub": user.email,
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    def get_current_user(
        self,
        email: str,
    ):
        return self.repository.get_by_email(
            self.db,
            email,
        )
