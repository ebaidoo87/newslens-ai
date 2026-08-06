from pydantic import BaseModel, ConfigDict

from app.schemas.article import ArticleResponse


class RecommendedArticleResponse(BaseModel):
    article: ArticleResponse
    score: int
    reasons: list[str]

    model_config = ConfigDict(
        from_attributes=True,
    )