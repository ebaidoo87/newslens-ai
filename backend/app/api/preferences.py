from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user_preference import (
    UserPreferenceItem,
    UserPreferencesResponse,
    UserPreferencesUpdate,
)
from app.services.user_preference_service import (
    UserPreferenceService,
)


router = APIRouter(
    prefix="/preferences",
    tags=["User Preferences"],
)


@router.get(
    "",
    response_model=UserPreferencesResponse,
)
def get_preferences(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = UserPreferenceService(db)

    preferences = (
        service.get_preferences(
            user_id=current_user.id,
        )
    )

    return {
        "preferences": [
            UserPreferenceItem(
                preference_type=(
                    preference.preference_type
                ),
                preference_value=(
                    preference.preference_value
                ),
            )
            for preference in preferences
        ]
    }


@router.put(
    "",
    response_model=UserPreferencesResponse,
)
def update_preferences(
    payload: UserPreferencesUpdate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = UserPreferenceService(db)

    try:
        preferences = (
            service.replace_preferences(
                user_id=current_user.id,
                preferences=(
                    payload.preferences
                ),
            )
        )

    except ValueError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=str(error),
        ) from error

    return {
        "preferences": [
            UserPreferenceItem(
                preference_type=(
                    preference.preference_type
                ),
                preference_value=(
                    preference.preference_value
                ),
            )
            for preference in preferences
        ]
    }


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_preferences(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    service = UserPreferenceService(db)

    service.clear_preferences(
        user_id=current_user.id,
    )

    return None