from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class JapaneseExample(Base):
    __tablename__ = 'japanese_example'

    row_id = Column(Integer, primary_key=True)
    entry = Column(String, nullable=False)
    origin = Column(Integer, nullable=False)
    tatoeba_id = Column(Integer)