import pytest

from fastapi import HTTPException

from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
)
from app.core.security import (
    hash_password,
    verify_password,
)
from app.models.user import User
from app.services.admin_user_service import (
    AdminUserService,
)

from tests.database import (
    TestingSessionLocal,
)


def create_user(
    *,
    username: str,
    email: str,
    role: str = "user",
    is_active: bool = True,
    token_version: int = 0,
    password: str = "Password123!",
) -> int:
    """
    Create a real user in the isolated test
    database and return its ID.
    """
    db = TestingSessionLocal()

    try:
        user = User(
            username=username,
            email=email,
            hashed_password=hash_password(
                password
            ),
            role=role,
            is_active=is_active,
            token_version=token_version,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user.id

    finally:
        db.close()


def get_user_by_id(
    db,
    user_id: int,
) -> User:
    """
    Retrieve a User bound to the current
    test database session.
    """
    user = db.get(
        User,
        user_id,
    )

    assert user is not None

    return user


# --------------------------------------------------
# GET USERS
# --------------------------------------------------


def test_get_users():
    create_user(
        username="userone",
        email="one@example.com",
    )

    create_user(
        username="usertwo",
        email="two@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        users = service.get_users()

        assert len(users) == 2

        usernames = {
            user.username
            for user in users
        }

        assert "userone" in usernames
        assert "usertwo" in usernames

    finally:
        db.close()


# --------------------------------------------------
# GET SINGLE USER
# --------------------------------------------------


def test_get_user():
    user_id = create_user(
        username="targetuser",
        email="target@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        user = service.get_user(
            user_id
        )

        assert user.id == user_id

        assert (
            user.username
            == "targetuser"
        )

        assert (
            user.email
            == "target@example.com"
        )

    finally:
        db.close()


def test_get_missing_user():
    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        with pytest.raises(
            NotFoundException
        ) as error:
            service.get_user(
                999999
            )

        assert (
            error.value.status_code
            == 404
        )

        assert (
            error.value.code
            == "USER_NOT_FOUND"
        )

    finally:
        db.close()


# --------------------------------------------------
# ROLE MANAGEMENT
# --------------------------------------------------


def test_update_role_rejects_invalid_role():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    user_id = create_user(
        username="user",
        email="user@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        with pytest.raises(
            BadRequestException
        ) as error:
            service.update_role(
                user_id=user_id,
                new_role="superadmin",
                current_admin=admin,
            )

        assert (
            error.value.status_code
            == 400
        )

        assert (
            error.value.code
            == "INVALID_USER_ROLE"
        )

    finally:
        db.close()


def test_admin_cannot_change_own_role():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        with pytest.raises(
            BadRequestException
        ) as error:
            service.update_role(
                user_id=admin_id,
                new_role="user",
                current_admin=admin,
            )

        assert (
            error.value.status_code
            == 400
        )

    finally:
        db.close()


def test_update_user_role():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    user_id = create_user(
        username="user",
        email="user@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        updated = (
            service.update_role(
                user_id=user_id,
                new_role="admin",
                current_admin=admin,
            )
        )

        assert (
            updated.role
            == "admin"
        )

        persisted = db.get(
            User,
            user_id,
        )

        assert persisted is not None

        assert (
            persisted.role
            == "admin"
        )

    finally:
        db.close()


# --------------------------------------------------
# ACTIVE / SUSPENDED STATUS
# --------------------------------------------------


def test_admin_cannot_suspend_self():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        with pytest.raises(
            HTTPException
        ) as error:
            service.update_active_status(
                user_id=admin_id,
                active=False,
                current_admin=admin,
            )

        assert (
            error.value.status_code
            == 400
        )

        assert (
            error.value.detail
            == (
                "You cannot disable "
                "your own account."
            )
        )

    finally:
        db.close()


def test_suspend_user():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    user_id = create_user(
        username="user",
        email="user@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        updated = (
            service.update_active_status(
                user_id=user_id,
                active=False,
                current_admin=admin,
            )
        )

        assert (
            updated.is_active
            is False
        )

        persisted = db.get(
            User,
            user_id,
        )

        assert persisted is not None

        assert (
            persisted.is_active
            is False
        )

    finally:
        db.close()


def test_activate_user():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    user_id = create_user(
        username="user",
        email="user@example.com",
        is_active=False,
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        updated = (
            service.update_active_status(
                user_id=user_id,
                active=True,
                current_admin=admin,
            )
        )

        assert (
            updated.is_active
            is True
        )

        persisted = db.get(
            User,
            user_id,
        )

        assert persisted is not None

        assert (
            persisted.is_active
            is True
        )

    finally:
        db.close()


# --------------------------------------------------
# ADMIN PASSWORD RESET
# --------------------------------------------------


def test_reset_password_rejects_mismatch():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    user_id = create_user(
        username="user",
        email="user@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        with pytest.raises(
            HTTPException
        ) as error:
            service.reset_password(
                user_id=user_id,
                new_password=(
                    "NewPassword123!"
                ),
                confirm_new_password=(
                    "DifferentPassword123!"
                ),
                current_admin=admin,
            )

        assert (
            error.value.status_code
            == 400
        )

        assert (
            error.value.detail
            == "Passwords do not match."
        )

    finally:
        db.close()


def test_reset_password_rejects_short_password():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    user_id = create_user(
        username="user",
        email="user@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        with pytest.raises(
            HTTPException
        ) as error:
            service.reset_password(
                user_id=user_id,
                new_password="short",
                confirm_new_password="short",
                current_admin=admin,
            )

        assert (
            error.value.status_code
            == 400
        )

        assert (
            error.value.detail
            == (
                "Password must be at least "
                "8 characters long."
            )
        )

    finally:
        db.close()


def test_reset_password_updates_hash_and_token_version():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    user_id = create_user(
        username="user",
        email="user@example.com",
        token_version=3,
        password="OldPassword123!",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        updated = (
            service.reset_password(
                user_id=user_id,
                new_password=(
                    "NewPassword123!"
                ),
                confirm_new_password=(
                    "NewPassword123!"
                ),
                current_admin=admin,
            )
        )

        assert (
            updated.token_version
            == 4
        )

        assert verify_password(
            "NewPassword123!",
            updated.hashed_password,
        )

        assert not verify_password(
            "OldPassword123!",
            updated.hashed_password,
        )

    finally:
        db.close()


def test_admin_cannot_reset_own_password():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        with pytest.raises(
            HTTPException
        ) as error:
            service.reset_password(
                user_id=admin_id,
                new_password=(
                    "NewPassword123!"
                ),
                confirm_new_password=(
                    "NewPassword123!"
                ),
                current_admin=admin,
            )

        assert (
            error.value.status_code
            == 400
        )

        assert (
            error.value.detail
            == (
                "Use your account settings "
                "to change your own password."
            )
        )

    finally:
        db.close()


# --------------------------------------------------
# DELETE USER
# --------------------------------------------------


def test_admin_cannot_delete_self():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        with pytest.raises(
            HTTPException
        ) as error:
            service.delete_user(
                user_id=admin_id,
                current_admin=admin,
            )

        assert (
            error.value.status_code
            == 400
        )

    finally:
        db.close()


def test_delete_user():
    admin_id = create_user(
        username="admin",
        email="admin@example.com",
        role="admin",
    )

    user_id = create_user(
        username="user",
        email="user@example.com",
    )

    db = TestingSessionLocal()

    try:
        service = AdminUserService(
            db
        )

        admin = get_user_by_id(
            db,
            admin_id,
        )

        service.delete_user(
            user_id=user_id,
            current_admin=admin,
        )

        deleted = db.get(
            User,
            user_id,
        )

        assert deleted is None

    finally:
        db.close()