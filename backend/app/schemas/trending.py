from pydantic import BaseModel, ConfigDict

from app.schemas.article import ArticleResponse


class TrendingArticleResponse(BaseModel):
    article: ArticleResponse
    trending_score: float
    bookmark_count: int
    view_count: int
    reasons: list[str]

    model_config = ConfigDict(
        from_attributes=True,
    )