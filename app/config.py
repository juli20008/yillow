import os


# Calculate database URI at module level
_db_url = os.environ.get('DATABASE_URL')
_database_uri = (_db_url.replace('postgres://', 'postgresql://') if _db_url 
                 else 'sqlite:///yillow.db')


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = _database_uri
