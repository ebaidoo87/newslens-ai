import httpx

from app.core.config import settings


class NewsProvider:

    async def search_articles(
        self,
        query: str,
        language: str = "en",
        page_size: int = 20,
    ) -> dict:
        params = {
            "q": query,
            "language": language,
            "sortBy": "publishedAt",
            "pageSize": page_size,
        }

        headers = {
            "X-Api-Key": settings.NEWS_API_KEY,
        }

        async with httpx.AsyncClient(
            base_url=settings.NEWS_API_URL,
            timeout=30.0,
        ) as client:
            response = await client.get(
                "/everything",
                params=params,
                headers=headers,
            )

            self._check_response(response)

            return response.json()


    @staticmethod
    def _check_response(
        response: httpx.Response,
    ) -> None:
        if response.status_code == 429:
            raise RuntimeError(
                "NewsAPI request limit reached. "
                "Wait for the quota window to reset."
            )

        if response.status_code == 401:
            raise RuntimeError(
                "NewsAPI rejected the API key."
            )

        if response.status_code == 426:
            raise RuntimeError(
                "This NewsAPI feature requires "
                "a different subscription plan."
            )

        response.raise_for_status()