from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine('postgresql://postgres:1234@localhost:5432/NihonCon')

Session = sessionmaker(bind=engine)
session = Session()

