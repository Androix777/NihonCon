from flask import Flask
from flask import jsonify
from flask import render_template
from flask_cors import CORS
from flask import request
import spacy
from jamdict import Jamdict

app = Flask(__name__)
CORS(app)
jmd = Jamdict()
nlp = spacy.load("ja_core_news_lg")


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/text', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return 'No'

    if request.method == 'POST':
        allWords = []

        value = request.form.get('value')
        doc = [{'word': w.text} for w in (nlp(value))]
        jmd = Jamdict()
        for i in range(len(doc)):
            translate = jmd.lookup(doc[i]['word'])
            if len(translate.entries) > 0:
                doc[i]['toolTip'] = []
                for entry in translate.entries:
                    doc[i]['toolTip'].append({'description': [str(x.gloss) for x in entry], 'kana':str(entry.kana_forms)})
        for word in doc:
            allWords.append(word)
        return jsonify({'ttText': allWords})


if __name__ == '__main__':
    app.run()
