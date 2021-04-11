from flask import Flask
from config import Config
from flask_cors import CORS
from flask_login import LoginManager
import sys
import os

sys.path.append("..")
print (os.getcwd())

# Application
app = Flask(__name__)

# Logins
login_manager = LoginManager(app)

# ???
CORS(app) # Temp

# Config
app.config.from_object(Config)

# Supporting files
from app import routes, errors, users