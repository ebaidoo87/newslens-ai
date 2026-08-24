from datetime import (
    datetime,
    timedelta,
)

import pytest

from app.models.audit_log import (
    AuditLog,
)
from app.models.user import User
from app.repositories.audit_repository import (
    AuditRepository,
)
from tests.database import (
    TestingSessionLocal,
)


@pytest.fixture
def db(clean_database):
    session = TestingSessionLocal()

    try:
        yield session

    finally:
        session.rollback()
        session.close()


def create_user(
    db,
    *,
    username: str,
    email: str,
    role: str = "user",
) -> User:
    user = User(
        username=username,
        email=email,
        hashed_password="test-hash",
        role=role,
        is_active=True,
        token_version=0,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def create_audit(
    db,
    *,
    action: str,
    admin_id: int,
    target_id: int,
    details: str,
    created_at: datetime,
) -> AuditLog:
    audit = AuditLog(
        admin_user_id=admin_id,
        target_user_id=target_id,
        action=action,
        details=details,
        created_at=created_at,
    )

    db.add(audit)
    db.commit()
    db.refresh(audit)

    return audit


def seed_logs(
    db,
):
    now = datetime.now()

    admin_one = create_user(
        db,
        username="audit_admin_one",
        email=(
            "audit-admin-one@"
            "example.com"
        ),
        role="admin",
    )

    admin_two = create_user(
        db,
        username="audit_admin_two",
        email=(
            "audit-admin-two@"
            "example.com"
        ),
        role="admin",
    )

    target_one = create_user(
        db,
        username="audit_target_one",
        email=(
            "audit-target-one@"
            "example.com"
        ),
    )

    target_two = create_user(
        db,
        username="audit_target_two",
        email=(
            "audit-target-two@"
            "example.com"
        ),
    )

    target_three = create_user(
        db,
        username="audit_target_three",
        email=(
            "audit-target-three@"
            "example.com"
        ),
    )

    target_four = create_user(
        db,
        username="audit_target_four",
        email=(
            "audit-target-four@"
            "example.com"
        ),
    )

    role_updated = create_audit(
        db,
        action="user_role_updated",
        admin_id=admin_one.id,
        target_id=target_one.id,
        details=(
            "Changed user role to admin."
        ),
        created_at=now,
    )

    suspended = create_audit(
        db,
        action="user_suspended",
        admin_id=admin_one.id,
        target_id=target_two.id,
        details=(
            "Suspended user account."
        ),
        created_at=(
            now - timedelta(days=1)
        ),
    )

    password_reset = create_audit(
        db,
        action="password_reset",
        admin_id=admin_two.id,
        target_id=target_three.id,
        details=(
            "Reset password for account."
        ),
        created_at=(
            now - timedelta(days=2)
        ),
    )

    deleted = create_audit(
        db,
        action="user_deleted",
        admin_id=admin_two.id,
        target_id=target_four.id,
        details=(
            "Deleted inactive account."
        ),
        created_at=(
            now - timedelta(days=10)
        ),
    )

    return {
        "now": now,
        "admin_one": admin_one,
        "admin_two": admin_two,
        "target_one": target_one,
        "target_two": target_two,
        "target_three": target_three,
        "target_four": target_four,
        "role_updated": role_updated,
        "suspended": suspended,
        "password_reset": password_reset,
        "deleted": deleted,
    }


def test_create_audit_log(
    db,
):
    repository = AuditRepository()

    admin = create_user(
        db,
        username="create_audit_admin",
        email=(
            "create-audit-admin@"
            "example.com"
        ),
        role="admin",
    )

    target = create_user(
        db,
        username="create_audit_target",
        email=(
            "create-audit-target@"
            "example.com"
        ),
    )

    audit = AuditLog(
        admin_user_id=admin.id,
        target_user_id=target.id,
        action="login",
        details="Admin logged in.",
    )

    created = repository.create(
        db,
        audit,
    )

    assert created.id is not None

    assert (
        created.admin_user_id
        == admin.id
    )

    assert (
        created.target_user_id
        == target.id
    )

    assert (
        created.action
        == "login"
    )


def test_get_recent_returns_latest_first(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    results = repository.get_recent(
        db,
        limit=2,
    )

    assert len(results) == 2

    assert (
        results[0].created_at
        >= results[1].created_at
    )

    assert (
        results[0].action
        == "user_role_updated"
    )


def test_get_all_returns_descending(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    results = repository.get_all(
        db
    )

    assert len(results) == 4

    assert (
        results[0].created_at
        >= results[-1].created_at
    )


def test_count_returns_total(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    assert (
        repository.count(db)
        == 4
    )


def test_paginated_limit(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            skip=0,
            limit=2,
        )
    )

    assert len(results) == 2


def test_paginated_offset(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    first_page = (
        repository.get_paginated(
            db,
            skip=0,
            limit=2,
        )
    )

    second_page = (
        repository.get_paginated(
            db,
            skip=2,
            limit=2,
        )
    )

    assert len(first_page) == 2
    assert len(second_page) == 2

    assert (
        first_page[0].id
        != second_page[0].id
    )


def test_filter_by_action(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            action="user_suspended",
        )
    )

    assert len(results) == 1

    assert (
        results[0].action
        == "user_suspended"
    )


def test_filter_by_admin(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            admin_user_id=(
                seeded[
                    "admin_two"
                ].id
            ),
        )
    )

    assert len(results) == 2

    assert all(
        audit.admin_user_id
        == seeded["admin_two"].id
        for audit in results
    )


def test_filter_by_target_user(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            target_user_id=(
                seeded[
                    "target_three"
                ].id
            ),
        )
    )

    assert len(results) == 1

    assert (
        results[0].action
        == "password_reset"
    )


def test_filter_by_date_from(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            date_from=(
                seeded["now"]
                - timedelta(days=2)
            ),
        )
    )

    assert len(results) == 3


def test_filter_by_date_to(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            date_to=(
                seeded["now"]
                - timedelta(days=5)
            ),
        )
    )

    assert len(results) == 1

    assert (
        results[0].action
        == "user_deleted"
    )


def test_filter_by_search_action(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            search="password",
        )
    )

    assert len(results) == 1

    assert (
        results[0].action
        == "password_reset"
    )


def test_filter_by_search_details(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            search="inactive",
        )
    )

    assert len(results) == 1

    assert (
        results[0].action
        == "user_deleted"
    )


def test_search_is_case_insensitive(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            search="PASSWORD",
        )
    )

    assert len(results) == 1

    assert (
        results[0].action
        == "password_reset"
    )


def test_combined_filters(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    results = (
        repository.get_paginated(
            db,
            admin_user_id=(
                seeded[
                    "admin_one"
                ].id
            ),
            target_user_id=(
                seeded[
                    "target_two"
                ].id
            ),
            date_from=(
                seeded["now"]
                - timedelta(days=2)
            ),
            action="user_suspended",
        )
    )

    assert len(results) == 1

    assert (
        results[0].target_user_id
        == seeded["target_two"].id
    )


def test_count_filtered_action(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    result = (
        repository.count_filtered(
            db,
            action="password_reset",
        )
    )

    assert result == 1


def test_count_filtered_admin(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    result = (
        repository.count_filtered(
            db,
            admin_user_id=(
                seeded[
                    "admin_one"
                ].id
            ),
        )
    )

    assert result == 2


def test_count_filtered_target_user(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    result = (
        repository.count_filtered(
            db,
            target_user_id=(
                seeded[
                    "target_three"
                ].id
            ),
        )
    )

    assert result == 1


def test_count_filtered_date_from(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    result = (
        repository.count_filtered(
            db,
            date_from=(
                seeded["now"]
                - timedelta(days=2)
            ),
        )
    )

    assert result == 3


def test_count_filtered_date_to(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    result = (
        repository.count_filtered(
            db,
            date_to=(
                seeded["now"]
                - timedelta(days=5)
            ),
        )
    )

    assert result == 1


def test_count_filtered_search(
    db,
):
    repository = AuditRepository()

    seed_logs(db)

    result = (
        repository.count_filtered(
            db,
            search="inactive",
        )
    )

    assert result == 1


def test_count_filtered_combined(
    db,
):
    repository = AuditRepository()

    seeded = seed_logs(db)

    result = (
        repository.count_filtered(
            db,
            action="user_suspended",
            admin_user_id=(
                seeded[
                    "admin_one"
                ].id
            ),
            target_user_id=(
                seeded[
                    "target_two"
                ].id
            ),
            date_from=(
                seeded["now"]
                - timedelta(days=2)
            ),
            date_to=seeded["now"],
            search="Suspended",
        )
    )

    assert result == 1