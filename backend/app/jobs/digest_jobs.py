from app.db.session import SessionLocal
from app.services.digest_service import (
    DigestService,
)


def queue_daily_digests():
    db = SessionLocal()

    try:
        service = DigestService(db)

        queued = service.queue_digests(
            "daily_digest"
        )

        print(
            f"📬 Queued {queued} "
            f"daily digests."
        )

    finally:
        db.close()


def queue_weekly_digests():
    db = SessionLocal()

    try:
        service = DigestService(db)

        queued = service.queue_digests(
            "weekly_digest"
        )

        print(
            f"📬 Queued {queued} "
            f"weekly digests."
        )

    finally:
        db.close()