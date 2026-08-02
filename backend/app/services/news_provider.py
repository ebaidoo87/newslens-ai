import httpx

from app.core.config import settings


class NewsProvider:
    async def get_top_headlines(
        self,
        country: str = "us",
        category: str = "technology",
    ):
        url = f"{settings.NEWS_API_URL}/top-headlines"

        params = {
            "country": country,
            "category": category,
            "apiKey": settings.NEWS_API_KEY,
            "pageSize": 20,
        }

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                url,
                params=params,
            )

            response.raise_for_status()

            return response.json()