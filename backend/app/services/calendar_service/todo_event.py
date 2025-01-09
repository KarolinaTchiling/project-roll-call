import datetime as dt
from .event import Event
from datetime import datetime
from .day_event import DayEvent
from app.services.auth_service.token import get_user_id
from app.services.user_settings import get_user_settings
from datetime import datetime, timedelta


class SuggestedToDo(Event):
    # constructor
    def __init__(self, creds):
        # calls superclass constructor
        super().__init__(creds)
        self.time_period = "Suggested To-Do List"
        self.time_max = (self.now + dt.timedelta(days=30)).isoformat()

    def get_relative_week(self, event_date):
        # Start of the current week (Monday)
        start_of_week = self.now.date() - timedelta(days=self.now.weekday())

        # Start of next week (next Monday)
        start_of_next_week = start_of_week + timedelta(days=7)

        if event_date < start_of_week:
            return "in the past"
        elif event_date < start_of_next_week:
            return f"{event_date.strftime('%A')} this week"
        elif start_of_next_week <= event_date < start_of_next_week + timedelta(days=7):
            return f"{event_date.strftime('%A')} next week"
        elif start_of_next_week + timedelta(days=7) <= event_date < start_of_next_week + timedelta(days=14):
            return f"{event_date.strftime('%A')} the following week"
        else:
            return f"{event_date.strftime('%A, %B %d')}"

    def get_suggested_tasks(self):
        todo = []
        counter = 1  # Initialize a counter for sequential IDs

        # Fetch all events from the parent class method
        all_events = super().get_events()

        # Get the user settings
        google_id = get_user_id()
        settings = get_user_settings(google_id)
        priority_type_string = settings.priority_type
        priority_type = getattr(settings.priorities, priority_type_string)

        high_keys = getattr(priority_type, "high")
        med_keys = getattr(priority_type, "medium")

        for event in all_events:
            summary = event.get("summary", "").lower()
            start_date = event.get("start", {}).get("dateTime") or event.get("start", {}).get("date")

            if start_date:
                event_datetime = datetime.fromisoformat(start_date).date()

                # Check for today's events
                if event_datetime == self.now.date():
                    todo.append({
                        "id": counter,  # Assign sequential ID
                        "task": f"Complete {event.get('summary')} today",
                        "date": event_datetime.isoformat(),
                    })
                    counter += 1  # Increment the counter

                # Check for high priority events in the next 3 weeks
                elif any(key.lower() in summary for key in high_keys):
                    if self.now.date() <= event_datetime <= (self.now + timedelta(weeks=3)).date():
                        relative_week = self.get_relative_week(event_datetime)
                        todo.append({
                            "id": counter,  # Assign sequential ID
                            "task": f"Prepare for {event.get('summary')} on {relative_week}",
                            "date": event_datetime.isoformat(),
                        })
                        counter += 1  # Increment the counter

        # Sort events by date (soonest first)
        todo.sort(key=lambda x: x["date"])

        return todo
    