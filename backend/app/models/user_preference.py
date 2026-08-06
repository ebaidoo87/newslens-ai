from sqlalchemy import (
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.base import Base


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    preference_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    preference_value: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    user = relationship(
        "User",
        back_populates="preferences",
    )