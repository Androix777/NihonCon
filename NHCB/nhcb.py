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

def get_user_data_by_id(id):
    
    user = session.query(User).filter_by(row_id = id).first()
    
    return user

def get_user_data_by_login(login):
    
    user = session.query(User).filter_by(login = login).first()
    
    return user

def register_user(login, password_hash):
    
    user = User(login = login, password_hash = password_hash)
    session.add(user)
    session.commit()
