from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
)


class AdminUserResponse(BaseModel):
    id: int

    username: str

    email: str

    role: str

    token_version: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )