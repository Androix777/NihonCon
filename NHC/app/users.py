from app import app, login_manager
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
from NHCB.nhcb import get_user_data_by_id, get_user_data_by_login, User as dbUser

class User(UserMixin):
    def __init__(self, id = None, login = None, password_hash = None):
        self.id = id
        self.login = login
        self.password_hash = password_hash
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def user_loader(id):

    # get row_id from db
    dbuser = get_user_data_by_id(id)
    
    user = User(dbuser.row_id, dbuser.login, dbuser.password_hash)
    return user

def get_user_by_login(login):
    
    dbuser = get_user_data_by_login(login)
    if dbuser is None:
        return None
    user = User(dbuser.row_id, dbuser.login, dbuser.password_hash)
    
    return user