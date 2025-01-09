import requests
from ..services.calendar_service.day_event import DayEvent
from ..services.calendar_service.week_event import WeekEvent
from ..services.calendar_service.future_event import FutureEvent
from ..services.calendar_service.todo_event import SuggestedToDo
from flask import jsonify, session, request
from . import cal
from ..services.auth_service.token import get_creds, get_creds_by_id

REQUIRED_SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

# route which returns a list of all the users calendars 
@cal.route("/calendars", methods=["GET"])
def get_calendars():
    creds = get_creds(REQUIRED_SCOPES)
    access_token = creds.token
    url = "https://www.googleapis.com/calendar/v3/users/me/calendarList"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors
        calendars = response.json().get("items", [])
        # return jsonify({"calendars": calendars})  #raw

        filtered_calendars = [
            {
                "calendarID": calendar["id"],
                "colorID": calendar.get("colorId"),  # Use .get() to handle missing fields
                "summary": calendar["summary"]
            }
            for calendar in calendars
        ]
        return jsonify({"calendars": filtered_calendars})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500



# route for getting the events for today from Google Calendar API
@cal.route("/day_events", methods=['GET'])
def get_day_events(google_id=None):
    # this is if the report is accessing this 
    if google_id:
        creds = get_creds_by_id(google_id, REQUIRED_SCOPES)
    else:
        creds = get_creds(session, REQUIRED_SCOPES)
    day_event = DayEvent(creds)
    events = day_event.get_events()
    events = day_event.categorize_events(events)
    return jsonify(events)

# route for getting the events for the next week from Google Calendar API
@cal.route("/week_events", methods=['GET'])
def get_week_events(google_id=None):
    # this is if the report is accessing this 
    if google_id:
        creds = get_creds_by_id(google_id, REQUIRED_SCOPES)
    else:
        creds = get_creds(session, REQUIRED_SCOPES)    
    week_event = WeekEvent(creds)
    events = week_event.get_events()
    events = week_event.categorize_events(events)
    return jsonify(events)

# route for getting the events for this month from Google Calendar API
@cal.route("/future_events", methods=['GET'])
def get_future_events(google_id=None):
    if google_id:
        creds = get_creds_by_id(google_id, REQUIRED_SCOPES)
    else:
        creds = get_creds(session, REQUIRED_SCOPES)
    future_event = FutureEvent(creds)
    events = future_event.get_events()
    events = future_event.categorize_events(events)
    return jsonify(events)

# route for getting the events for the suggested To-Do List from Google Calendar API
@cal.route("/to_do", methods=['GET'])
def get_to_do(google_id=None):
    if google_id:
        creds = get_creds_by_id(google_id, REQUIRED_SCOPES)
    else:
        creds = get_creds(session, REQUIRED_SCOPES)
    events = SuggestedToDo(creds).get_suggested_tasks()
    return jsonify(events)