from app import app
from app.users import User, get_user_by_login
from app.forms import LoginForm, RegistrationForm
from flask import request, render_template, jsonify, redirect, url_for, flash
from flask_login import login_user, logout_user, current_user
from NHCB.nhcb import get_sentences_by_kanji, register_user

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
    form = LoginForm()
    if form.validate_on_submit():
        user = get_user_by_login(form.login.data)
        if user is None or not user.check_password(form.password.data):
            flash('Invalid login/password')
            return redirect(url_for('login'))
        login_user(user, remember = form.remember_me.data)
        return redirect(url_for('index'))
    return render_template('login.html', form = form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods = ['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(login=form.login.data)
        user.set_password(form.password.data)
        
        register_user(user.login, user.password_hash)
        
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

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
    
