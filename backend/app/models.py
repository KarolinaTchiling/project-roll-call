from mongoengine import Document, EmbeddedDocument, EmbeddedDocumentField, StringField, URLField, ListField, EmailField, DictField, IntField, BooleanField
from datetime import time

class Calendar(EmbeddedDocument):
    calendarID = StringField(required=True)  # Calendar ID
    colorID = StringField()  # Color ID
    summary = StringField()  # Summary of the calendar
    include = BooleanField(default=True)  # Include flag

class Settings(EmbeddedDocument):
    greeting = StringField(default="word")              # word/quote
    future_weeks = IntField(default=4)               # 4 - 12
    future_organize = StringField(default="category")   # category/priority
    calendars = ListField(EmbeddedDocumentField(Calendar), default=list)

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

