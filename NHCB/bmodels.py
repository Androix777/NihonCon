from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class JapaneseExample(Base):
    __tablename__ = 'japanese_example'

    row_id = Column(Integer, primary_key = True)
    entry = Column(String, nullable = False)
    origin = Column(Integer, nullable = False)
    tatoeba_id = Column(Integer)
    kanji_count = Column(Integer)
    
class JapaneseExampleKanji(Base):
    __tablename__ = 'japanese_example_kanji'
    
    row_id = Column(Integer, primary_key = True)
    kanji = Column(String, nullable = False)
    japanese_example_row_id = Column(Integer, nullable = False)
    
class User(Base):
    __tablename__ = 'user'
    
    row_id = Column(Integer, primary_key = True)
    login = Column(String)
    password_hash = Column(String(128))