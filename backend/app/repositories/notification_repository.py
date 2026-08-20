from sqlalchemy.orm import (
    Session,
    joinedload,
)

from app.models.notification import Notification


class NotificationRepository:

    def get_by_user_and_article(
        self,
        db: Session,
        user_id: int,
        article_id: int,
    ) -> Notification | None:
        return (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.article_id == article_id,
            )
            .first()
        )

    def create_many(
        self,
        db: Session,
        notifications: list[Notification],
    ) -> list[Notification]:
        if not notifications:
            return []

        db.add_all(
            notifications
        )

        db.commit()

        for notification in notifications:
            db.refresh(
                notification
            )

        return notifications

    def get_all_by_user(
        self,
        db: Session,
        user_id: int,
        limit: int = 50,
    ) -> list[Notification]:
        return (
            db.query(Notification)
            .options(
                joinedload(Notification.article)
            )
            .filter(
                Notification.user_id == user_id
            )
            .order_by(
                Notification.created_at.desc()
            )
            .limit(limit)
            .all()
        )

    def get_unread_count(
        self,
        db: Session,
        user_id: int,
    ) -> int:
        return (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read.is_(False),
            )
            .count()
        )

    def get_by_id(
        self,
        db: Session,
        notification_id: int,
    ):
        return (
            db.query(Notification)
            .options(
            joinedload(Notification.article)
            )
            .filter(
            Notification.id == notification_id
            )
            .first()
        )

    def mark_as_read(
        self,
        db: Session,
        notification: Notification,
    ):
        notification.is_read = True

        db.commit()

        db.refresh(notification)

        return notification

    def mark_all_as_read(
        self,
        db: Session,
        user_id: int,
    ):
        (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .update(
            {
                Notification.is_read: True
            },
            synchronize_session=False,
        )
    )

        db.commit()

    def delete(
        self,
        db: Session,
        notification: Notification,
    ):
        db.delete(notification)

        db.commit()



    def mark_all_as_read(
        self,
        db: Session,
        user_id: int,
    ):
        (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .update(
            {
                Notification.is_read: True
            },
            synchronize_session=False,
        )
    )

        db.commit()

    def delete(
        self,
        db: Session,
        notification: Notification,
    ):
        db.delete(notification)

        db.commit()

    def delete_all_by_user(
        self,
        db: Session,
        user_id: int,
    ) -> int:
        deleted_count = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
        )
        .delete(
            synchronize_session=False,
        )
    )

        db.commit()

        return deleted_count


    def delete_read_by_user(
        self,
        db: Session,
        user_id: int,
    ) -> int:
        deleted_count = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(True),
        )
        .delete(
            synchronize_session=False,
        )
    )

        db.commit()

        return deleted_count