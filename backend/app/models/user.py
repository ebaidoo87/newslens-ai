from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
    String(20),
    nullable=False,
    default="user",
    server_default="user",
    index=True,
    )

    token_version: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False,
    )

    created_at: Mapped[object] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[object] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    bookmarks = relationship(
    "Bookmark",
    back_populates="user",
    cascade="all, delete-orphan",
    passive_deletes=True,
    )

    reading_history = relationship(
    "ReadingHistory",
    back_populates="user",
    cascade="all, delete-orphan",
    passive_deletes=True,
    )

    preferences = relationship(
    "UserPreference",
    back_populates="user",
    cascade="all, delete-orphan",
    passive_deletes=True,
    )

    notifications = relationship(
    "Notification",
    back_populates="user",
    cascade="all, delete-orphan",
    passive_deletes=True,
)