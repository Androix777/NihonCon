from NHCB.bdatabase import session
from NHCB.bmodels import JapaneseExample, JapaneseExampleKanji, User
from sqlalchemy import func, tablesample, select, column
from sqlalchemy.orm import aliased

#%%

def get_random_sentence():
    sample = aliased(JapaneseExample, tablesample(JapaneseExample, 1))
    return session.query(sample).limit(1).first().entry

def get_sentences_by_kanji(kanjiList, min_kanji = 3, max_unknown_kanji = 1):
    examples = session.execute(select([column('example'), column('origin')]).
                             select_from(func.get_kanji_examples_by_kanji(kanjiList, min_kanji, max_unknown_kanji).alias())).fetchall()
    print(select([column('example'), column('origin')]).
                             select_from(func.get_kanji_examples_by_kanji(kanjiList, min_kanji, max_unknown_kanji).alias()))
    return [i._row for i in examples][0:500]

def get_user_data(login):
    user = User()
    
    # get data from db
    
    user.row_id = 1
    user.login = 'lain'
    user.password_hash = 'qwe123'
    return user