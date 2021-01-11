from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy

#start

from flask import jsonify
import spacy
from jamdict import Jamdict
from flask_cors import CORS

from multiprocessing import Lock
from multiprocessing.managers import BaseManager

lock = Lock()
nlp = spacy.load("ja_core_news_lg")

def Tokenizer(line):
    with lock:
        nlp2 = nlp(line)
    return [{'word': w.text} for w in nlp2]

def GetTranslation(tokens):
    jmd = Jamdict()
    allWords = []
    for i in range(len(tokens)):
        translate = jmd.lookup(tokens[i]['word'])
        if len(translate.entries) > 0:
            tokens[i]['toolTip'] = []
            for entry in translate.entries:
                tokens[i]['toolTip'].append({'description': [str(x.gloss) for x in entry], 'kana':str(entry.kana_forms)})
    for word in tokens:
        allWords.append(word)
    return jsonify({'ttText': allWords})


#end

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db = SQLAlchemy(app)

from app import routes, models