from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


engine = create_engine(
    settings.database_url,
    echo=settings.debug,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)