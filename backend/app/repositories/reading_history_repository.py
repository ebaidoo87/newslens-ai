from datetime import datetime

from sqlalchemy.orm import (
    Session,
    joinedload,
)

from app.models.reading_history import (
    ReadingHistory,
)


class ReadingHistoryRepository:

    def get_by_user_and_article(
        self,
        db: Session,
        user_id: int,
        article_id: int,
    ) -> ReadingHistory | None:
        return (
            db.query(ReadingHistory)
            .filter(
                ReadingHistory.user_id
                == user_id,
                ReadingHistory.article_id
                == article_id,
            )
            .first()
        )

    def get_all_by_user(
        self,
        db: Session,
        user_id: int,
        limit: int = 50,
    ) -> list[ReadingHistory]:
        return (
            db.query(ReadingHistory)
            .options(
                joinedload(
                    ReadingHistory.article
                )
            )
            .filter(
                ReadingHistory.user_id
                == user_id
            )
            .order_by(
                ReadingHistory.viewed_at.desc()
            )
            .limit(limit)
            .all()
        )

    def create(
        self,
        db: Session,
        history: ReadingHistory,
    ) -> ReadingHistory:
        db.add(history)
        db.commit()
        db.refresh(history)

        return history

    def update_viewed_at(
        self,
        db: Session,
        history: ReadingHistory,
    ) -> ReadingHistory:
        history.viewed_at = datetime.utcnow()

        db.add(history)
        db.commit()
        db.refresh(history)

        return history

    def clear_all_by_user(
        self,
        db: Session,
        user_id: int,
    ) -> None:
        (
            db.query(ReadingHistory)
            .filter(
                ReadingHistory.user_id
                == user_id
            )
            .delete(
                synchronize_session=False
            )
        )

        db.commit()