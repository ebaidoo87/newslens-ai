from pydantic import BaseModel, Field


class UserPreferenceItem(BaseModel):
    preference_type: str = Field(
        min_length=1,
        max_length=30,
    )

    preference_value: str = Field(
        min_length=1,
        max_length=100,
    )


class UserPreferencesUpdate(BaseModel):
    preferences: list[UserPreferenceItem]


class UserPreferencesResponse(BaseModel):
    preferences: list[UserPreferenceItem]