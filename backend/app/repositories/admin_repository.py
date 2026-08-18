from sqlalchemy.orm import Session

from app.models.user import User


class AdminRepository:

    def get_all_users(
        self,
        db: Session,
    ):
        return (
            db.query(User)
            .order_by(User.created_at.desc())
            .all()
        )

    def get_user(
        self,
        db: Session,
        user_id: int,
    ):
        return (
            db.query(User)
            .filter(
                User.id == user_id,
            )
            .first()
        )

    def save(
        self,
        db: Session,
        user: User,
    ):
        db.add(user)

        db.commit()

        db.refresh(user)

        return user

    def update_role(
        self,
        db: Session,
        user: User,
        role: str,
    ):
        user.role = role

        db.commit()
        db.refresh(user)

        return user

    def update_active_status(
        self,
        db: Session,
        user: User,
        active: bool,
    ):
        user.is_active = active

        db.commit()

        db.refresh(user)

        return user

    def delete_user(
        self,
        db: Session,
        user: User,
    ) -> None:
        db.delete(user)
        db.commit()