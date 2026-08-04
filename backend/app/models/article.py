from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    title: Mapped[str] = mapped_column(String(500))

    summary: Mapped[str | None] = mapped_column(Text)

    content: Mapped[str | None] = mapped_column(Text)

    url: Mapped[str] = mapped_column(String(1000), unique=True)
    

    image_url: Mapped[str | None] = mapped_column(String(1000),nullable=True,
)

    source: Mapped[str] = mapped_column(String(100))

    author: Mapped[str | None] = mapped_column(String(200))

    language: Mapped[str] = mapped_column(String(20), default="en")

    country: Mapped[str] = mapped_column(String(20), default="global")

    category: Mapped[str] = mapped_column(String(50), default="general")

    published_at: Mapped[datetime | None] = mapped_column(DateTime)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )