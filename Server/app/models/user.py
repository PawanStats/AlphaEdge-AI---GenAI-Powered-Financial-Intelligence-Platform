from sqlalchemy import Column, Integer, String
from app.models import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)


    ## DATABASE MODEL FOR USER TABLE, USED FOR AUTHENTICATION PURPOSES