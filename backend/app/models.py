from mongoengine import (
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
    StringField,
    URLField,
    ListField,
    EmailField,
    IntField,
    BooleanField,
)
from datetime import time


class WordType(EmbeddedDocument):
    high = ListField(default=["quiz", "assignment", "midterm", "due", "meeting"])
    medium = ListField(default=["lecture", "work"])
    low = ListField(default=list)

class CalendarType(EmbeddedDocument):
    high = ListField(default=list)
    medium = ListField(default=list)
    low = ListField(default=list)

class ColorType(EmbeddedDocument):
    high = ListField(default=list)
    medium = ListField(default=list)
    low = ListField(default=list)

class Calendar(EmbeddedDocument):
    calendarID = StringField(required=True)  # Calendar ID
    colorID = StringField()  # Color ID
    summary = StringField()  # Summary of the calendar
    include = BooleanField(default=True)  # Include flag

class Creds(EmbeddedDocument):
    token = StringField(required=True) 
    refresh_token = StringField(required=True) 
    token_uri = URLField(required=True) 
    id_token = StringField(required=True) 
    client_id = StringField(required=True) 
    client_secret = StringField(required=True) 
    scopes = ListField(URLField(), required=True)

class Priority(EmbeddedDocument):
    word_type = EmbeddedDocumentField(WordType, default=WordType)
    calendar_type = EmbeddedDocumentField(CalendarType, default=CalendarType)
    color_type = EmbeddedDocumentField(ColorType, default=ColorType)

class Settings(EmbeddedDocument):
    greeting = StringField(default="word")              # word/quote
    future_weeks = IntField(default=4)                  # 4 - 12
    future_organize = StringField(default="category")   # category/priority
    calendars = ListField(EmbeddedDocumentField(Calendar), default=list)
    priorities = EmbeddedDocumentField(Priority, default=Priority) 
    priority_type = StringField(default="word_type")    # word_type, calendar_type, color_type

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.priorities:  # Initialize priorities with one default Priority if empty
            self.priorities = [Priority()]

class User(Document):
    google_id = StringField(required=True, unique=True)  
    email = EmailField(required=True, unique=True)       
    f_name = StringField(required=True, default="User")                 
    l_name = StringField(required=True, default="")                  
    pfp = URLField()  
    creds = EmbeddedDocumentField(Creds)   
    settings = EmbeddedDocumentField(Settings, default=Settings)
