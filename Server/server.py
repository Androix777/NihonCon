from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request
import spacy
from jamdict import Jamdict

from multiprocessing import Lock
from multiprocessing.managers import BaseManager

app = Flask(__name__)
CORS(app)
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

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/text', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return 'No'

    if request.method == 'POST':
        value = request.form.get('value')
        tokens = Tokenizer(value)
        return GetTranslation(tokens)


if __name__ == '__main__':
    app.run()