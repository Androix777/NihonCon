from flask import Flask
from flask import render_template
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

values = []

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/text', methods = ['GET', 'POST'])
def index():
    if request.method == 'GET':
        if(len(values) > 0):
            return(values.join(' '))
        else:
            return('')
    
    if request.method == 'POST':
        if(request.form.get('value') not in values):
            values.append(request.form.get('value'))
        if(len(values) > 0):
            return(values[-1])
        else:
            return('')

if __name__ == '__main__':
    app.run()