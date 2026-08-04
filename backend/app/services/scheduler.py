from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger


from app.db.session import SessionLocal
from app.services.import_service import ImportService

scheduler = AsyncIOScheduler()

import_service = None

async def import_job():
    db = SessionLocal()

    try:
        import_service = ImportService(db)

        result = await import_service.import_articles()

        print(
            f"📰 Imported "
            f"{result['imported']} "
            f"of "
            f"{result['received']} "
            f"articles."
        )

    except Exception as e:
        print(f"❌ Import failed: {e}")

    finally:
        db.close()


def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(
            import_job,
            IntervalTrigger(hours=1),
            id="news-import",
            replace_existing=True,
            max_instances=1,
            coalesce=True,
        )

        scheduler.start()

        print("🚀 Scheduler started.")