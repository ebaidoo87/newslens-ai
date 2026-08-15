from apscheduler.schedulers.asyncio import (
    AsyncIOScheduler,
)
from apscheduler.triggers.interval import (
    IntervalTrigger,
)

from app.data.category_queries import (
    CATEGORY_QUERIES,
)
from app.db.session import SessionLocal
from app.services.import_service import (
    ImportService,
)

from app.jobs.email_worker import (
    process_email_queue,
)

from app.jobs.digest_jobs import (
    queue_daily_digests,
    queue_weekly_digests,
)

scheduler = AsyncIOScheduler()

CATEGORIES = list(
    CATEGORY_QUERIES.keys()
)



async def import_job():
    db = SessionLocal()

    try:
        service = ImportService(db)

        for category in CATEGORIES:
            try:
                result = (
                    await service.import_articles(
                        category=category,
                    )
                )

                print(
                    f"📰 {category}: imported "
                    f"{result['imported']} of "
                    f"{result['received']} articles."
                )

            except RuntimeError as error:
                print(
                    f"❌ Import stopped: {error}"
                )

                # Stop the loop after a rate limit.
                break

            except Exception as error:
                print(
                    f"❌ {category} failed: "
                    f"{error}"
                )

    finally:
        db.close()


def start_scheduler():
    if scheduler.running:
        return

    scheduler.add_job(
        import_job,
        IntervalTrigger(hours=6),
        id="news-import",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )

    scheduler.add_job(
        process_email_queue,
        trigger="interval",
        minutes=1,
        id="email_worker",
        replace_existing=True,
    )

    scheduler.add_job(
    queue_daily_digests,
    trigger="cron",
    hour=8,
    minute=0,
    id="daily_digest",
    replace_existing=True,
    )

    scheduler.add_job(
    queue_weekly_digests,
    trigger="cron",
    day_of_week="mon",
    hour=8,
    minute=0,
    id="weekly_digest",
    replace_existing=True,
    )
    scheduler.start()

    print("🚀 News scheduler started.")