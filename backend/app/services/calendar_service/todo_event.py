import datetime as dt
from .event import Event
from datetime import datetime
from .day_event import DayEvent


class SuggestedToDo(Event):
    # constructor
    def __init__(self, creds):
        # calls superclass constructor
        super().__init__(creds)
        
        # we don't need a time range for to-do list, just initialize list
        self.time_period = "Suggested To-Do List"
        self.time_min = self.now.isoformat()
        self.time_max = None

    def get_suggested_tasks(self):
        print("SuggestedToDo get_events called...")
        # # fetch all events from the parent class method
        # all_events = super().get_events()

        # high_priority_colors = []
        # high_priority_events = []

        # # filter high-priority events
        # for key,value in self.user.settings.items():
        #     if isinstance(value, dict) and value.get("priority") == "High Priority":
        #         high_priority_colors.append(value.get("color"))

        # for i in high_priority_colors:
        #     high_priority_events += self.filter_events_by_color(all_events, str(i))

        # high_priority_events = self.sort_events_by_date(high_priority_events)
        
        # # limit the high-priority events to the top 5
        # if len(high_priority_events) > 5:
        #     high_priority_events = high_priority_events[:5]

        # # DEBUG: print out the filtered high-priority events 
        # # print("HIGH PRIO EVENTS:")
        # # self.print_events(high_priority_events)

        # # Get today's events using the DayEvent class
        # day_event = DayEvent(self.creds)  # Initialize the DayEvent class to get today's events
        # today_events = day_event.get_events()  # Fetch events for today
        
        # # Print today's events (for debugging)
        # # print("TODAYS EVENTS:")
        # # self.print_events(today_events)

        # # Get rid of overlap between high priority events and daily events
        # unique_events = { 
        #     (
        #         event.get('summary', ''), 
        #         event['start'].get('dateTime') or event['start'].get('date'), 
        #         event['end'].get('dateTime') or event['end'].get('date')
        #     ): event 
        #     for event in high_priority_events + today_events
        # }.values()

        # # Sort the unique events by start date/time
        # sorted_events = self.sort_events_by_date(list(unique_events))

        # # Print the combined and sorted events (for debugging)
        # # print("TODO LIST:")
        # # self.print_events(sorted_events)

        # # Return the combined, sorted events
        return ""
    