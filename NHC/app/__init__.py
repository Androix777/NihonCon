from flask import Flask
from config import Config
from flask_cors import CORS
import sys
import os

sys.path.append("..")
print (os.getcwd())
app = Flask(__name__)
CORS(app) # Temp
app.config.from_object(Config)

from app import routes, errors