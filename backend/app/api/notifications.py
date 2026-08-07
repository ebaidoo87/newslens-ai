from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.notification import (
    NotificationActionResponse,
    NotificationCountResponse,
    NotificationResponse,
)
from app.services.notification_service import (
    NotificationService,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)

@router.get(
    "",
    response_model=list[NotificationResponse],
)
def get_notifications(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = NotificationService(db)

    return service.get_notifications(
        current_user.id
    )

@router.get(
    "/count",
    response_model=NotificationCountResponse,
)
def unread_count(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = NotificationService(db)

    return {
        "unread_count":
        service.get_unread_count(
            current_user.id
        )
    }

@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
)
def mark_read(
    notification_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = NotificationService(db)

    return service.mark_as_read(
        current_user.id,
        notification_id,
    )

@router.patch(
    "/read-all",
    response_model=NotificationActionResponse,
)
def mark_all_read(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = NotificationService(db)

    service.mark_all_as_read(
        current_user.id
    )

    return {
        "success": True,
        "message": (
            "All notifications marked as read"
        ),
    }

@router.delete(
    "/{notification_id}",
    response_model=NotificationActionResponse,
)
def delete_notification(
    notification_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = NotificationService(db)

    service.delete_notification(
        current_user.id,
        notification_id,
    )

    return {
        "success": True,
        "message": "Notification deleted",
    }

