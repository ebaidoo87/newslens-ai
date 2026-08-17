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

    def update_role(
        self,
        user_id: int,
        new_role: str,
        current_admin_id: int,
    ):
        if new_role not in {
            "user",
            "admin",
        }:
            raise HTTPException(
                status_code=400,
                detail="Invalid role",
            )

        user = self.get_user(
            user_id
        )

        if user.id == current_admin_id:
            raise HTTPException(
                status_code=400,
                detail=(
                    "You cannot change "
                    "your own admin role"
                ),
            )

        return (
            self.repository.update_role(
                self.db,
                user,
                new_role,
            )
        )

    def update_active_status(
        self,
        user_id: int,
        active: bool,
        current_admin_id: int,
    ):
        user = self.get_user(
            user_id,
        )

        if user.id == current_admin_id:
            raise HTTPException(
                status_code=400,
                detail=(
                    "You cannot disable "
                    "your own account."
                ),
            )

        return (
            self.repository.update_active_status(
                self.db,
                user,
                active,
            )
        )