from sqlalchemy.orm import Session

from app.models.user_preference import (
    UserPreference,
)
from app.repositories.user_preference_repository import (
    UserPreferenceRepository,
)
from app.schemas.user_preference import (
    UserPreferenceItem,
)


ALLOWED_PREFERENCE_TYPES = {
    "category",
    "country",
    "keyword",
    "alert",
    "email_alert",
}


class UserPreferenceService:

    def __init__(self, db: Session):
        self.db = db

        self.repository = (
            UserPreferenceRepository()
        )

    def get_preferences(
        self,
        user_id: int,
    ) -> list[UserPreference]:
        return self.repository.get_all_by_user(
            self.db,
            user_id,
        )

    def replace_preferences(
        self,
        user_id: int,
        preferences: list[
            UserPreferenceItem
        ],
    ) -> list[UserPreference]:
        cleaned_preferences: list[
            UserPreference
        ] = []

        seen: set[
            tuple[str, str]
        ] = set()

        for item in preferences:
            preference_type = (
                item.preference_type
                .strip()
                .lower()
            )

            preference_value = (
                item.preference_value
                .strip()
                .lower()
            )

            if (
                preference_type
                not in ALLOWED_PREFERENCE_TYPES
            ):
                raise ValueError(
                    "Unsupported preference type"
                )

            if not preference_value:
                continue

            key = (
                preference_type,
                preference_value,
            )

            if key in seen:
                continue

            seen.add(key)

            cleaned_preferences.append(
                UserPreference(
                    user_id=user_id,
                    preference_type=(
                        preference_type
                    ),
                    preference_value=(
                        preference_value
                    ),
                )
            )

        return self.repository.replace_all(
            self.db,
            user_id,
            cleaned_preferences,
        )

    def clear_preferences(
        self,
        user_id: int,
    ) -> None:
        self.repository.delete_all_by_user(
            self.db,
            user_id,
        )