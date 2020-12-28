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

@app.route('/text', methods = ['GET', 'POST'])
def index():
    if request.method == 'GET':
        return('No')
    
    if request.method == 'POST':
        allWords = []
        
        value = request.form.get('value')
        doc = [(w.text, w.pos_) for w in (nlp(value))]
        for word in doc:
            allWords.append(word)
        return Flask.jsonify(allWords)
        

if __name__ == '__main__':
    app.run()