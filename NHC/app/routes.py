from app import app
from flask import request, render_template, jsonify
from NHCB.nhcb import get_sentences_by_kanji

#UI

@app.route('/')
@app.route('/index')
def index():
    return render_template('main.html')

@app.route('/workspace')
def workspace():
    return render_template('workspace.html', title = 'Workspace')

@app.route('/examples')
def examples():
    return render_template('examples.html')

@app.route('/kanjilists')
def kanjilists():
    return render_template('kanjilists.html')

#API

@app.route('/history', methods=['GET', 'POST'])
def history():
    if request.method == 'GET':
        return 'No'

    if request.method == 'POST':
        return request.form.get('value')
    
'''
@app.route('/get-examples', methods=['POST'])
def get_examples():
    if request.method == 'POST':
        return jsonify({'examples' : get_sentences_by_kanji(['人', '私'], 2, 1)})
'''

@app.route('/get-examples', methods = ['POST'])
def get_examples():
    if request.method == 'POST':
        kanjiList = request.form.get('list')
        print(kanjiList)
        return jsonify({'examples' : get_sentences_by_kanji(['人', '私'], 2, 0)})