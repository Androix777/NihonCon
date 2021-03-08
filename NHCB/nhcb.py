from bdatabase import session
from bmodels import *
from sqlalchemy import func, tablesample
#from sqlalchemy.sql.expression import tablesample
from sqlalchemy.orm import aliased

def GetRandomSentence():
    sample = aliased(JapaneseExample, tablesample(JapaneseExample, 1))
    return session.query(sample).limit(1).first().entry

def GetSentencesByKanjiList(kanjiList):
    selected_kanji = session.query(
        JapaneseExampleKanji
    ).filter(
        JapaneseExampleKanji.kanji.in_(kanjiList)
    ).subquery()
    
    selected_examples = session.query(
        selected_kanji.c.japanese_example_row_id, 
        func.count(selected_kanji.c.kanji).label('selected_kanji_count')
    ).group_by(
        selected_kanji.c.japanese_example_row_id
    ).subquery()
    return session.query(
        selected_examples.c.japanese_example_row_id, 
        selected_examples.c.selected_kanji_count, 
        JapaneseExample.kanji_count, 
        JapaneseExample.entry
    ).join(
        JapaneseExample,
        selected_examples.c.japanese_example_row_id == JapaneseExample.row_id
    ).filter(
        JapaneseExample.kanji_count - selected_examples.c.selected_kanji_count <= 1,
        JapaneseExample.kanji_count > 3
    ).all()