from app import app
from app import Tokenizer, GetTranslation
from app.forms import LoginForm
from flask import request, render_template, flash, redirect, url_for
#UI

@app.route('/')
@app.route('/index')
def index():
    return render_template('main.html')

@app.route('/workspace')
def workspace():
    return render_template('workspace.html', title = 'Workspace')

@app.route('/login', methods = ['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login request for user {}, remember_me = {}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('index'))
    return render_template('login.html', title = 'Sign In', form = form)


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
    
