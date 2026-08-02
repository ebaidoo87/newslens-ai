from datetime import datetime

from pydantic import BaseModel


class ArticleResponse(BaseModel):
    id: int
    title: str
    summary: str | None
    url: str
    source: str
    author: str | None
    language: str
    country: str
    category: str
    published_at: datetime | None

    model_config = {
        "from_attributes": True,
    }