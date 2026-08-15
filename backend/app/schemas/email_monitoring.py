from datetime import datetime

from pydantic import BaseModel


class EmailStatsResponse(BaseModel):
    total: int

    pending: int
    processing: int
    sent: int
    failed: int

    accepted: int
    delivered: int
    bounced: int
    complained: int
    delivery_delayed: int

    retrying: int
    suppressed: int


class RecentEmailResponse(BaseModel):
    id: int
    recipient: str
    subject: str

    email_type: str
    status: str

    provider: str
    provider_status: str | None

    retry_count: int

    provider_message_id:str | None

    created_at: datetime
    sent_at: datetime | None

    last_error: str | None