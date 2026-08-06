from pydantic import BaseModel, ConfigDict

from app.schemas.article import ArticleResponse


class DiscoveredArticleResponse(BaseModel):
    article: ArticleResponse
    discovery_score: int
    reasons: list[str]

    model_config = ConfigDict(
        from_attributes=True,
    )