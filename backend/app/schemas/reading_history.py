from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.article import ArticleResponse


class ReadingHistoryResponse(BaseModel):
    id: int
    user_id: int
    article_id: int
    viewed_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class ViewedArticleResponse(BaseModel):
    id: int
    viewed_at: datetime
    article: ArticleResponse

    model_config = ConfigDict(
        from_attributes=True,
    )