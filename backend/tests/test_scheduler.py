import pytest

from app.services import scheduler


class FakeSession:
    def __init__(self):
        self.closed = False

    def close(self):
        self.closed = True


@pytest.mark.anyio
async def test_import_job_processes_categories(
    monkeypatch,
):
    db = FakeSession()

    imported = []

    class FakeImportService:
        def __init__(
            self,
            session,
        ):
            assert session is db

        async def import_articles(
            self,
            category,
        ):
            imported.append(
                category
            )

            return {
                "received": 5,
                "imported": 3,
            }

    monkeypatch.setattr(
        scheduler,
        "SessionLocal",
        lambda: db,
    )

    monkeypatch.setattr(
        scheduler,
        "ImportService",
        FakeImportService,
    )

    monkeypatch.setattr(
        scheduler,
        "CATEGORIES",
        [
            "technology",
            "business",
        ],
    )

    await scheduler.import_job()

    assert imported == [
        "technology",
        "business",
    ]

    assert db.closed is True


@pytest.mark.anyio
async def test_import_job_stops_after_runtime_error(
    monkeypatch,
):
    db = FakeSession()

    called = []

    class FakeImportService:
        def __init__(
            self,
            session,
        ):
            pass

        async def import_articles(
            self,
            category,
        ):
            called.append(
                category
            )

            raise RuntimeError(
                "Rate limit"
            )

    monkeypatch.setattr(
        scheduler,
        "SessionLocal",
        lambda: db,
    )

    monkeypatch.setattr(
        scheduler,
        "ImportService",
        FakeImportService,
    )

    monkeypatch.setattr(
        scheduler,
        "CATEGORIES",
        [
            "technology",
            "business",
        ],
    )

    await scheduler.import_job()

    assert called == [
        "technology"
    ]

    assert db.closed is True


@pytest.mark.anyio
async def test_import_job_continues_after_normal_exception(
    monkeypatch,
):
    db = FakeSession()

    called = []

    class FakeImportService:
        def __init__(
            self,
            session,
        ):
            pass

        async def import_articles(
            self,
            category,
        ):
            called.append(
                category
            )

            if (
                category
                == "technology"
            ):
                raise ValueError(
                    "Temporary failure"
                )

            return {
                "received": 2,
                "imported": 1,
            }

    monkeypatch.setattr(
        scheduler,
        "SessionLocal",
        lambda: db,
    )

    monkeypatch.setattr(
        scheduler,
        "ImportService",
        FakeImportService,
    )

    monkeypatch.setattr(
        scheduler,
        "CATEGORIES",
        [
            "technology",
            "business",
        ],
    )

    await scheduler.import_job()

    assert called == [
        "technology",
        "business",
    ]

    assert db.closed is True


class FakeScheduler:
    def __init__(
        self,
        running=False,
    ):
        self.running = running
        self.jobs = []
        self.started = False

    def add_job(
        self,
        func,
        *args,
        **kwargs,
    ):
        self.jobs.append(
            {
                "func": func,
                "args": args,
                "kwargs": kwargs,
            }
        )

    def start(self):
        self.started = True

    def stop_scheduler():
        if scheduler.running:
            scheduler.shutdown(
                wait=False
        )


def test_start_scheduler_does_nothing_when_already_running(
    monkeypatch,
):
    fake = FakeScheduler(
        running=True
    )

    monkeypatch.setattr(
        scheduler,
        "scheduler",
        fake,
    )

    scheduler.start_scheduler()

    assert fake.jobs == []
    assert fake.started is False


def test_start_scheduler_registers_jobs(
    monkeypatch,
):
    fake = FakeScheduler(
        running=False
    )

    monkeypatch.setattr(
        scheduler,
        "scheduler",
        fake,
    )

    scheduler.start_scheduler()

    assert fake.started is True

    assert len(
        fake.jobs
    ) == 4

    job_ids = {
        job["kwargs"]["id"]
        for job in fake.jobs
    }

    assert job_ids == {
        "news-import",
        "email_worker",
        "daily_digest",
        "weekly_digest",
    }


