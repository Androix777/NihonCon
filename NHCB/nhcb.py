from bdatabase import session
from bmodels import *
from sqlalchemy.sql.expression import tablesample
from sqlalchemy.orm import aliased

def GetRandomSentence():
    sample = aliased(JapaneseExample, tablesample(JapaneseExample, 1))
    return session.query(sample).limit(1).first().entry