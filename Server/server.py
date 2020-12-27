from flask import Flask
from flask import render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/hello')
def index():
    return render_template("test.html",
        title = 'HelloHello',
        name = 'name')

if __name__ == '__main__':
    app.run()