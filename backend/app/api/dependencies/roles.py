from collections.abc import Callable

from fastapi import (
    Depends,
    HTTPException,
    status,
)

from app.api.auth import (
    get_current_user,
)
from app.models.user import User

from app.core.exceptions import (
    ForbiddenException,
)


def require_admin(
    current_user: User = Depends(
        get_current_user
    ),
) -> User:
    if current_user.role != "admin":
        raise ForbiddenException(
            message=(
                "Administrator access required"
            ),
            code="ADMIN_REQUIRED",
        )

    return current_user


def require_roles(
    *allowed_roles: str,
) -> Callable:

    def dependency(
        current_user: User = Depends(
            get_current_user
        ),
    ) -> User:
        if (
            current_user.role
            not in allowed_roles
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_403_FORBIDDEN
                ),
                detail=(
                    "You do not have permission "
                    "to access this resource"
                ),
            )

        return current_user

    return dependency