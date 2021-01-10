from app import app
from app import Tokenizer, GetTranslation
from flask import request

@app.route('/')
@app.route('/index')
def index():
    return 'Index'

@app.route('/history', methods=['GET', 'POST'])
def history():
    if request.method == 'GET':
        return 'No'

    if request.method == 'POST':
        return request.form.get('value')

@app.route('/tooltip', methods=['GET', 'POST'])
def tooltip():
    if request.method == 'GET':
        return 'No'

    if request.method == 'POST':
        value = request.form.get('value')
        tokens = Tokenizer(value)
        return GetTranslation(tokens)