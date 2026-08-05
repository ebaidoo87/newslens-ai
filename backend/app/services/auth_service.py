from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)

from app.schemas.user import (
    UserLogin,
    UserRegister,
    UserUpdate,
)

from app.schemas.user import (
    PasswordChange,
    UserLogin,
    UserRegister,
    UserUpdate,
)

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserLogin, UserRegister


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = UserRepository()

    def register(
        self,
        user_data: UserRegister,
    ) -> User:
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
            hashed_password=hash_password(
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
    ) -> dict[str, str]:
        user = self.repository.get_by_email(
            self.db,
            credentials.email,
        )

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(
            credentials.password,
            user.hashed_password,
        ):
            raise ValueError("Invalid email or password")

        access_token = create_access_token(
            {
                "sub": user.email,
                "user_id": user.id,
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }

    def get_current_user(
        self,
        email: str,
    ) -> User | None:
        return self.repository.get_by_email(
            self.db,
            email,
        )

    def update_profile(
        self,
        user: User,
        user_data: UserUpdate,
    ) -> User:
        if not verify_password(
        user_data.current_password,
        user.hashed_password,
        ):
            raise ValueError(
            "Current password is incorrect"
        )

        if (
        user_data.email
        and user_data.email != user.email
        ):
            existing_email = (
                self.repository.get_by_email(
                    self.db,
                    user_data.email,
                )
            )

            if existing_email:
                raise ValueError(
                    "Email already exists"
                )

            user.email = user_data.email

        if (
            user_data.username
            and user_data.username != user.username
        ):
            existing_username = (
                self.repository.get_by_username(
                    self.db,
                    user_data.username,
                )
            )

            if existing_username:
                raise ValueError(
                    "Username already exists"
                )

            user.username = user_data.username

        return self.repository.update(
            self.db,
            user,
        )

    def change_password(
        self,
        user: User,
        password_data: PasswordChange,
    ) -> None:
        if not verify_password(
            password_data.current_password,
            user.hashed_password,
        ):
            raise ValueError(
                "Current password is incorrect"
            )

        if (
            password_data.new_password
            != password_data.confirm_new_password
        ):
            raise ValueError(
                "New passwords do not match"
            )

        if (
            password_data.current_password
            == password_data.new_password
        ):
            raise ValueError(
                "New password must be different "
                "from the current password"
            )

        user.hashed_password = hash_password(
            password_data.new_password
        )

        self.repository.update(
            self.db,
            user,
        )