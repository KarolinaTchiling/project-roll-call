from . import user
from app.services.user_service import get_name, get_pfp, get_user
from app.services.auth_service.token import get_user_id
from flask import session, request, jsonify

@user.route("/name", methods=['GET'])
def name():
    try:
        google_id = get_user_id(session)
        name = get_name(google_id) 
        return jsonify(name), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user.route("/primary_calendar", methods=["GET"])
def primary_calendar():
    try:

        google_id = get_user_id(session)
        user = get_user(google_id)
        settings = user.settings

        # Ensure the settings object contains the 'calendars' attribute
        if not hasattr(settings, "calendars") or not settings.calendars:
            return jsonify({"error": "Calendars not found in user settings"}), 404

        # Extract the primary calendar (assume it's the calendar with the user's email as calendarID)
        primary_calendar = next(
            (calendar for calendar in settings.calendars if calendar.calendarID == user.email),
            None,
        )

        # If the primary calendar is found, return its details
        if primary_calendar:
            return jsonify({
                "summary": getattr(primary_calendar, "summary", "Primary Calendar"),
                "calendarID": getattr(primary_calendar, "calendarID", None),
                "colorID": getattr(primary_calendar, "colorID", None),
            }), 200
        else:
            return jsonify({"error": "Primary calendar not found"}), 404

    except user.DoesNotExist:
        return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@user.route("/pfp", methods=['GET'])
def pfp():
    try:
        google_id = get_user_id(session)
        name = get_pfp(google_id) 
        return jsonify(name), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
