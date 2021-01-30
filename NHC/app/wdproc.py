from flask import jsonify
import spacy
from jamdict import Jamdict

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