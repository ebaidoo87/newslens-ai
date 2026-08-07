from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.article import ArticleResponse


class NotificationResponse(BaseModel):
    id: int
    notification_type: str
    title: str
    message: str
    is_read: bool
    created_at: datetime
    article: ArticleResponse

    model_config = ConfigDict(
        from_attributes=True,
    )


class NotificationCountResponse(BaseModel):
    unread_count: int


class NotificationActionResponse(BaseModel):
    success: bool
    message: str

class NotificationDeleteResponse(BaseModel):
    success: bool
    deleted_count: int
    message: str