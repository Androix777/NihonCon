from app import app
from app.users import User, get_user_by_login
from app.forms import LoginForm
from flask import request, render_template, jsonify, redirect, url_for
from flask_login import login_user, logout_user, current_user
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

@app.route('/login', methods = ['GET', 'POST'])
def login():
    #logout_user()
    #login_user(User(1, 'lain', 'qwe123'))
    print(vars(current_user))
    form = LoginForm()
    if form.validate_on_submit():
        user = get_user_by_login(form.login.data)
        if user is None or not form.password.data == '123':
            return redirect(url_for('index'))
        login_user(user)
        return redirect(url_for('index'))
    return render_template('login.html', form = LoginForm())
    '''
    user = User()
    user.id = 1
    login_user(user)
    return 'asd'
    '''

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

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
    
