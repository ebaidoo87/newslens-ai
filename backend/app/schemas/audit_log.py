from datetime import datetime

from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: int

    admin_user_id: int | None

    target_user_id: int | None

    action: str

    details: str | None

    created_at: datetime

    model_config = {
        "from_attributes": True,
    }