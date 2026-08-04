import httpx

from app.core.config import settings


class NewsProvider:
    async def get_top_headlines(self):
        params = {
            "country": "us",
            "category": "technology",
            "pageSize": 20,
        }

        headers = {
            "X-Api-Key": settings.NEWS_API_KEY,
        }

        async with httpx.AsyncClient(
            base_url=settings.NEWS_API_URL,
            timeout=20.0,
        ) as client:
            response = await client.get(
                "/top-headlines",
                params=params,
                headers=headers,
            )

            if response.status_code == 429:
                raise RuntimeError(
                    "NewsAPI request limit reached. "
                    "Wait for the quota window to reset."
                )

            response.raise_for_status()

            return response.json()