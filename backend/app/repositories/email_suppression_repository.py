from sqlalchemy.orm import Session

from app.models.email_suppression import (
    EmailSuppression,
)


class EmailSuppressionRepository:

    def get_by_email(
        self,
        db: Session,
        email: str,
    ) -> EmailSuppression | None:
        return (
            db.query(EmailSuppression)
            .filter(
                EmailSuppression.email
                == email.lower().strip()
            )
            .first()
        )

    def is_suppressed(
        self,
        db: Session,
        email: str,
    ) -> bool:
        return (
            self.get_by_email(
                db,
                email,
            )
            is not None
        )

    def create(
        self,
        db: Session,
        suppression: EmailSuppression,
    ) -> EmailSuppression:
        db.add(suppression)
        db.commit()
        db.refresh(suppression)

        return suppression

    def delete_by_email(
        self,
        db: Session,
        email: str,
    ) -> bool:
        suppression = (
            self.get_by_email(
                db,
                email,
            )
        )

        if not suppression:
            return False

        db.delete(suppression)
        db.commit()

        return True