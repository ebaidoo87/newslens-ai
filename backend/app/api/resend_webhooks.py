import json

import resend
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import logger
from app.db.session import get_db
from app.services.resend_webhook_service import (
    ResendWebhookService,
)

router = APIRouter(
    prefix="/webhooks/resend",
    tags=["Webhooks"],
)

@router.post(
    "",
    status_code=status.HTTP_200_OK,
)
async def receive_resend_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    if not settings.RESEND_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=500,
            detail=(
                "Resend webhook secret "
                "is not configured"
            ),
        )

    raw_body = await request.body()

    headers = dict(
        request.headers
    )

    try:
        event = resend.Webhooks.verify(
            payload=raw_body.decode(
                "utf-8"
            ),
            headers=headers,
            secret=(
                settings.RESEND_WEBHOOK_SECRET
            ),
        )

    except Exception as error:
        logger.warning(
            "Invalid Resend webhook: %s",
            error,
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid webhook signature"
            ),
        ) from error

    if not isinstance(
        event,
        dict,
    ):
        event = json.loads(
            raw_body
        )

    service = (
        ResendWebhookService(db)
    )

    processed = (
        service.process_event(
            event
        )
    )

    logger.info(
        "Resend webhook received: "
        "type=%s processed=%s",
        event.get("type"),
        processed,
    )

    return {
        "received": True,
    }