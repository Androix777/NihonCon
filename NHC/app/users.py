from app import app, login_manager
from flask_login import UserMixin
from NHCB.nhcb import get_user_data, User as dbUser

class User(UserMixin):
    def __init__(self, id, login, password_hash):
        self.id = id
        self.login = login
        self.password_hash = password_hash

@login_manager.user_loader
def user_loader(id):

    # get row_id from db
    dbuser = get_user_data(id)
    
    user = User(dbuser.row_id, dbuser.login, dbuser.password_hash)
    return user

def get_user_by_login(login):
    
    dbuser = get_user_data(login)
    user = User(dbuser.row_id, dbuser.login, dbuser.password_hash)
    
    return user