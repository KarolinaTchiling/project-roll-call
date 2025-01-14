from mongoengine import DoesNotExist
from ..models import User, Settings, Calendar
from ..services.auth_service.token import get_creds
from flask import session, jsonify
import requests

REQUIRED_SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]


def set_user_calendars(user):
    """
    Fetch calendars from Google Calendar API and update the user's settings.calendars in the database.
    """
    creds = get_creds(REQUIRED_SCOPES)  # Retrieve credentials for Google API
    access_token = creds.token
    url = "https://www.googleapis.com/calendar/v3/users/me/calendarList"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    try:

        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
        calendars = response.json().get("items", [])

        # Filter and format the calendar data
        filtered_calendars = [
            {
                "calendarID": calendar["id"],
                "colorID": calendar.get("colorId"), 
                "summary": calendar["summary"],
                "include": True
            }
            for calendar in calendars
        ]
        # Update the user's settings.calendars
        user.settings.calendars = [
            Calendar(**calendar) for calendar in filtered_calendars
        ]
        user.save()
        print("User calendars stored in DB!")

    except DoesNotExist:
        print("Error: User not found in the database.")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching calendars: {e}")



def get_user_settings(google_id):
    try:
        user = User.objects.get(google_id=google_id)
        return user.settings
    except DoesNotExist:
        print("User doesn't exist.")
        return None




        
