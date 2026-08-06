from sqlalchemy.orm import Session

from app.models.user_preference import (
    UserPreference,
)


class UserPreferenceRepository:

    def get_all_by_user(
        self,
        db: Session,
        user_id: int,
    ) -> list[UserPreference]:
        return (
            db.query(UserPreference)
            .filter(
                UserPreference.user_id
                == user_id
            )
            .order_by(
                UserPreference.preference_type,
                UserPreference.preference_value,
            )
            .all()
        )

    def delete_all_by_user(
        self,
        db: Session,
        user_id: int,
    ) -> None:
        (
            db.query(UserPreference)
            .filter(
                UserPreference.user_id
                == user_id
            )
            .delete(
                synchronize_session=False
            )
        )

        db.commit()

    def replace_all(
        self,
        db: Session,
        user_id: int,
        preferences: list[
            UserPreference
        ],
    ) -> list[UserPreference]:
        (
            db.query(UserPreference)
            .filter(
                UserPreference.user_id
                == user_id
            )
            .delete(
                synchronize_session=False
            )
        )

        db.add_all(preferences)
        db.commit()

        for preference in preferences:
            db.refresh(preference)

        return preferences