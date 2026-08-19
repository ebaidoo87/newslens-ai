import logging
import time
import uuid

from fastapi import Request

from starlette.middleware.base import (
    BaseHTTPMiddleware,
)

logger = logging.getLogger(
    "newslens.request"
)


class RequestLoggingMiddleware(
    BaseHTTPMiddleware
):

    async def dispatch(
        self,
        request: Request,
        call_next,
    ):
        request_id = (
            request.headers.get(
                "X-Request-ID"
            )
            or str(uuid.uuid4())
        )

        request.state.request_id = (
            request_id
        )

        start_time = (
            time.perf_counter()
        )

        logger.info(
            "request_started "
            "request_id=%s "
            "method=%s "
            "path=%s",
            request_id,
            request.method,
            request.url.path,
        )

        try:
            response = await call_next(
                request
            )

        except Exception:
            logger.exception(
                "request_failed "
                "request_id=%s "
                "method=%s "
                "path=%s",
                request_id,
                request.method,
                request.url.path,
            )

            raise

        duration_ms = (
            (
                time.perf_counter()
                - start_time
            )
            * 1000
        )

        response.headers[
            "X-Request-ID"
        ] = request_id

        logger.info(
            "request_completed "
            "request_id=%s "
            "method=%s "
            "path=%s "
            "status=%s "
            "duration_ms=%.2f",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )

        return response