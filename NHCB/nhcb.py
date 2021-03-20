from bdatabase import session
from bmodels import JapaneseExample, JapaneseExampleKanji
from sqlalchemy import func, tablesample
from sqlalchemy.orm import aliased

def GetRandomSentence():
    sample = aliased(JapaneseExample, tablesample(JapaneseExample, 1))
    return session.query(sample).limit(1).first().entry

def GetSentencesByKanjiList(kanjiList, min_kanji = 3, max_unknown_kanji = 1):
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
        
    examples = session.query(
        selected_examples.c.japanese_example_row_id, 
        selected_examples.c.selected_kanji_count, 
        JapaneseExample.kanji_count, 
        JapaneseExample.entry
    ).join(
        JapaneseExample,
        selected_examples.c.japanese_example_row_id == JapaneseExample.row_id
    ).filter(
        JapaneseExample.kanji_count - selected_examples.c.selected_kanji_count <= max_unknown_kanji,
        JapaneseExample.kanji_count >= min_kanji
    ).all()
    return [list(i) for i in examples]