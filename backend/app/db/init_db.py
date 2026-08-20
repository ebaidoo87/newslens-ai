from app.db import Base, engine

# Register models


def init_db():
    Base.metadata.create_all(bind=engine)