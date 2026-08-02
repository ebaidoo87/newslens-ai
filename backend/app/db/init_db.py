from app.db import Base, engine

# Register models
from app.models import Article


def init_db():
    Base.metadata.create_all(bind=engine)