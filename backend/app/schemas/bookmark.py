from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.article import ArticleResponse


class BookmarkResponse(BaseModel):
    id: int
    user_id: int
    article_id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class BookmarkedArticleResponse(BaseModel):
    id: int
    created_at: datetime
    article: ArticleResponse

    model_config = ConfigDict(
        from_attributes=True,
    )


class BookmarkStatusResponse(BaseModel):
    article_id: int
    is_bookmarked: bool