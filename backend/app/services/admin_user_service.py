from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.repositories.admin_repository import (
    AdminRepository,
)


class AdminUserService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

        self.repository = (
            AdminRepository()
        )

    def get_users(self):
        return (
            self.repository.get_all_users(
                self.db,
            )
        )

    def get_user(
        self,
        user_id: int,
    ):
        user = (
            self.repository.get_user(
                self.db,
                user_id,
            )
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        return user