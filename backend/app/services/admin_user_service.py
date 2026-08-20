from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
)
from app.core.security import hash_password
from app.models.user import User
from app.repositories.admin_repository import (
    AdminRepository,
)
from app.services.audit_service import (
    AuditService,
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

        self.audit_service = (
            AuditService(db)
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
            raise NotFoundException(
                message="User not found",
                code="USER_NOT_FOUND",
            )

        return user

    def update_role(
        self,
        user_id: int,
        new_role: str,
        current_admin: User,
    ):
        if new_role not in {
            "user",
            "admin",
        }:
            raise BadRequestException(
                message="Invalid role",
                code="INVALID_USER_ROLE",
            )

        user = self.get_user(
            user_id
        )

        if user.id == current_admin.id:
            raise BadRequestException(
                message=(
                    "You cannot change "
                    "your own admin role"
                ),
                code="SELF_ROLE_CHANGE_NOT_ALLOWED",
            )

        updated_user = (
            self.repository.update_role(
                self.db,
                user,
                new_role,
            )
        )

        self.audit_service.log(
            admin=current_admin,
            target=updated_user,
            action=(
                "promote_user"
                if new_role == "admin"
                else "demote_user"
            ),
            details=(
                f"Changed role to "
                f"{new_role}"
            ),
        )

        return updated_user

    def update_active_status(
        self,
        user_id: int,
        active: bool,
        current_admin: User,
    ):
        user = self.get_user(
            user_id,
        )

        if user.id == current_admin.id:
            raise HTTPException(
                status_code=400,
                detail=(
                    "You cannot disable "
                    "your own account."
                ),
            )

        updated_user = (
            self.repository
            .update_active_status(
                self.db,
                user,
                active,
            )
        )

        self.audit_service.log(
            admin=current_admin,
            target=updated_user,
            action=(
                "activate_user"
                if active
                else "suspend_user"
            ),
            details=(
                "Account activated"
                if active
                else "Account suspended"
            ),
        )

        return updated_user

    def reset_password(
        self,
        user_id: int,
        new_password: str,
        confirm_new_password: str,
        current_admin: User,
    ):
        user = self.get_user(
            user_id
        )

        if user.id == current_admin.id:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Use your account settings "
                    "to change your own password."
                ),
            )

        if (
            new_password
            != confirm_new_password
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Passwords do not match."
                ),
            )

        if len(new_password) < 8:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Password must be at least "
                    "8 characters long."
                ),
            )

        user.hashed_password = (
            hash_password(
                new_password
            )
        )

        # Invalidate existing login tokens.
        user.token_version += 1

        self.db.commit()
        self.db.refresh(user)

        self.audit_service.log(
            admin=current_admin,
            target=user,
            action="reset_password",
            details=(
                "Administrator reset "
                "user password."
            ),
        )

        return user

    def delete_user(
        self,
        user_id: int,
        current_admin: User,
    ) -> None:
        user = self.get_user(
            user_id
        )

        if user.id == current_admin.id:
            raise HTTPException(
                status_code=400,
                detail=(
                    "You cannot delete "
                    "your own account."
                ),
            )

        username = user.username
        email = user.email

        self.audit_service.log(
            admin=current_admin,
            target=user,
            action="delete_user",
            details=(
                f"Deleted {username} "
                f"({email})"
            ),
        )

        self.repository.delete_user(
            self.db,
            user,
        )