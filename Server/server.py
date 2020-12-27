from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/hello')
def index():
    return render_template("test.html",
        title = 'HelloHello',
        name = 'name')

@app.route('/func_for=<num>')
def func(num):
    return "Answer {}".format(int(num) * int(num))

if __name__ == '__main__':
    app.run()