import datetime as dt
from .event import Event
from datetime import datetime, timedelta
from ...models import User
from app.services.auth_service.token import get_user_id
from app.services.user_settings import get_user_settings


# this class is a subclass of the Event class
# it initializes the time range for events from now to 30 days from now

class FutureEvent(Event):
    # constructor
    def __init__(self, creds):
        # calls superclass constructor
        super().__init__(creds)
        # set the end of the time range as today + 30 days
        future_weeks = self.user.settings["future_weeks"]
        end_of_month = self.now + dt.timedelta(days=7*future_weeks)
        # self.time_min = self.now.isoformat()
        self.time_max = end_of_month.isoformat()
        self.time_period = "Future at a glance"
    

    def categorize_events(self, events):
        # print(events)
        high_priority_events = []
        med_priority_events = []

        # Get the user settings
        google_id = get_user_id()
        settings = get_user_settings(google_id)
        priority_type_string = settings.priority_type
        priority_type = getattr(settings.priorities, priority_type_string)

        high_keys = getattr(priority_type, "high")
        med_keys = getattr(priority_type, "medium")

        # print(high_keys)
        # print(med_keys)

        # print(priority_type_string)

        if priority_type_string == "word_type":
            for event in events:
                summary = event.get("summary", "").lower() 
                if any(key.lower() in summary for key in high_keys):
                    start_date = event.get("start", {}).get("dateTime") or event.get("start", {}).get("date")
                    if start_date:
                        high_priority_events.append({"event": event.get("summary"), "date": start_date})
            for event in events:
                summary = event.get("summary", "").lower()
                if any(key.lower() in summary for key in med_keys):
                    start_date = event.get("start", {}).get("dateTime") or event.get("start", {}).get("date")
                    if start_date:
                        med_priority_events.append({"event": event.get("summary"), "date": start_date})

        elif priority_type_string == "color_type":
            for event in events:
                color = event.get('colorId', '00')
                if color in high_keys:
                    start_date = event.get("start", {}).get("dateTime") or event.get("start", {}).get("date")
                    if start_date:
                        high_priority_events.append({"event": event.get("summary"), "date": start_date})
            for event in events:
                color = event.get('colorId', '00')
                if color in med_keys:
                    start_date = event.get("start", {}).get("dateTime") or event.get("start", {}).get("date")
                    if start_date:
                        med_priority_events.append({"event": event.get("summary"), "date": start_date})

        elif priority_type_string == "calendar_type":
            for event in events:
                cal_id = event.get('organizer', {}).get('email')
                if cal_id in high_keys:
                    start_date = event.get("start", {}).get("dateTime") or event.get("start", {}).get("date")
                    if start_date:
                        high_priority_events.append({"event": event.get("summary"), "date": start_date})
            for event in events:
                cal_id = event.get('organizer', {}).get('email')
                if cal_id in med_keys:
                    start_date = event.get("start", {}).get("dateTime") or event.get("start", {}).get("date")
                    if start_date:
                        med_priority_events.append({"event": event.get("summary"), "date": start_date})
        
        # Sort events by date (soonest first)
        high_priority_events.sort(key=lambda x: x["date"])
        med_priority_events.sort(key=lambda x: x["date"])

        # Save only soonest 10
        if (len(med_priority_events) > 10):
            med_priority_events = med_priority_events[:10]

        # # Output the sorted high-priority events
        # print(f"High Priority Events: {len(high_priority_events)}")
        # for event in high_priority_events:
        #     print(f"Date: {event['date']}, Event: {event['event']}")
        
        # # Output the sorted high-priority events
        # print(f"Med Priority Events: {len(med_priority_events)}")
        # for event in med_priority_events:
        #     print(f"Date: {event['date']}, Event: {event['event']}")


        return {
            "high_priority": high_priority_events,
            "medium_priority": med_priority_events
        }



