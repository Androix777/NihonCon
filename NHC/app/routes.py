from app import app
from app import Tokenizer, GetTranslation
from app.forms import LoginForm
from app.models import User
from flask import request, render_template, flash, redirect, url_for
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse

#UI

@app.route('/')
@app.route('/index')
def index():
    return render_template('main.html')

@app.route('/workspace')
@login_required
def workspace():
    return render_template('workspace.html', title = 'Workspace')

@app.route('/login', methods = ['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username = form.username.data).first()
        print(user)
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username and/or password')
            return redirect(url_for('login'))
        login_user(user, remember = form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title = 'Sign In', form = form)

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

@app.route('/tooltip', methods=['GET', 'POST'])
def tooltip():
    if request.method == 'GET':
        return 'No'

    if request.method == 'POST':
        value = request.form.get('value')
        tokens = Tokenizer(value)
        return GetTranslation(tokens)
    
