from app import app
from flask import request, render_template

#UI

@app.route('/')
@app.route('/index')
def index():
    return render_template('main.html')

@app.route('/workspace')
def workspace():
    return render_template('workspace.html', title = 'Workspace')

#API

@app.route('/history', methods=['GET', 'POST'])
def history():
    if request.method == 'GET':
        return 'No'

    if request.method == 'POST':
        return request.form.get('value')