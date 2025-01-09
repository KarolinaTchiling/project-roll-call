from mongoengine import Document, EmbeddedDocument, EmbeddedDocumentField, StringField, URLField, ListField, EmailField, DictField, IntField
from datetime import time

class Settings(EmbeddedDocument):
    greeting = StringField(default="word")              # word/quote
    future_weeks = IntField(default=4)               # 4 - 12
    future_organize = StringField(default="category")   # category/priority
    calendars = ListField(default=list) 

class Creds(EmbeddedDocument):
    token = StringField(required=True) 
    refresh_token = StringField(required=True) 
    token_uri = URLField(required=True) 
    id_token = StringField(required=True) 
    client_id=StringField(required=True) 
    client_secret=StringField(required=True) 
    scopes = ListField(URLField(), required=True)        

class User(Document):
    google_id = StringField(required=True, unique=True)  
    email = EmailField(required=True, unique=True)       
    f_name = StringField(required=True, default="User")                 
    l_name = StringField(required=True, default="")                  
    pfp = URLField()  
    creds = EmbeddedDocumentField(Creds)   
    settings = EmbeddedDocumentField(Settings, default=Settings)   

