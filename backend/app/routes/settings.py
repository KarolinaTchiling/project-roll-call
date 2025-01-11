from app.services.auth_service.token import get_user_id, print_session
from app.services.user_settings import get_user_settings, set_user_calendars
from flask import session, request, jsonify
from . import setting
import json
from flask import request, jsonify, current_app
from mongoengine.errors import DoesNotExist
from bson import json_util  # Optional for BSON serialization
import json
from app.models import User  # Ensure the User model is imported


@setting.route("/get_settings", methods=['GET'])
def get_settings():
    try:
        google_id = get_user_id(session)
        settings = get_user_settings(google_id)  # Fetch the settings object

        # Serialize settings to a dictionary
        if hasattr(settings, 'to_mongo'):
            settings_dict = settings.to_mongo().to_dict()
        elif hasattr(settings, '__dict__'):
            settings_dict = {key: value for key, value in settings.__dict__.items() if not key.startswith('_')}
        else:
            settings_dict = settings  # Assume it's already a dict if no conversion is needed

        return jsonify(settings_dict), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@setting.route('/update_priority_type', methods=['POST'])
def update_priority_type():
    try:
        google_id = get_user_id(session)  # Fetch the user's Google ID
        user = User.objects.get(google_id=google_id)  # Fetch the user object

        # Access the settings object
        settings = user.settings

        # Parse the request data
        data = request.json
        priority_type = data.get('priority_type')  # e.g., 'word_type', 'color_type', 'calendar_type'

        # Validate input
        valid_priority_types = ['word_type', 'color_type', 'calendar_type']
        if not priority_type or priority_type not in valid_priority_types:
            return jsonify({'error': f'Invalid priority type: {priority_type}'}), 400

        # Update the priority_type in the settings
        settings['priority_type'] = priority_type

        # Save the updated settings object back to the database
        user.update(set__settings=settings)

        # Return a success response
        return jsonify({'message': 'Priority type updated successfully', 'priority_type': priority_type}), 200
    except DoesNotExist:
        return jsonify({'error': "User doesn't exist."}), 404
    except Exception as e:
        current_app.logger.error(f"Error in update_priority_type: {str(e)}")
        return jsonify({'error': str(e)}), 500


@setting.route('/update_calendar_include', methods=['POST'])
def update_calendar_include():
    try:
        google_id = get_user_id(session)  # Fetch the user's Google ID
        user = User.objects.get(google_id=google_id)  # Fetch the user object

        # Parse request data
        data = request.json
        calendarID = data.get('calendarID')
        include = data.get('include')

        # Validate input
        if calendarID is None or include is None:
            return jsonify({"error": "calendarID and include are required"}), 400

        # Update the `include` field for the specified calendar
        settings = user.settings
        for calendar in settings['calendars']:
            if calendar['calendarID'] == calendarID:
                calendar['include'] = include
                break

        # Save the updated settings object
        user.update(set__settings=settings)

        return jsonify({"message": "Calendar include status updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@setting.route('/set_calendars', methods=['POST'])
def update_calendars():
    """
    Fetch calendars from Google Calendar API and update the user's settings.calendars.
    """
    try:
        google_id = get_user_id(session)  # Fetch the user's Google ID from the session
        user = User.objects.get(google_id=google_id)  # Retrieve the user object from the database

        # Call the set_user_calendars function
        set_user_calendars(user)
        
        return jsonify({"message": "User calendars updated successfully!"}), 200

    except DoesNotExist:
        return jsonify({"error": "User not found in the database."}), 404

    except Exception as e:
        current_app.logger.error(f"Error updating calendars: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500



@setting.route('/update_greeting', methods=['POST'])
def update_greeting():
    try:
        google_id = get_user_id(session)  # Fetch the user's Google ID
        user = User.objects.get(google_id=google_id)  # Fetch the user object

        # Parse request data
        data = request.json
        greeting = data.get('greeting')

        # Validate input
        if greeting not in ["word", "quote"]:
            return jsonify({"error": "Invalid greeting value. Allowed values are 'word' or 'quote'."}), 400

        # Access and update the `greeting` field in user settings
        settings = user.settings
        settings['greeting'] = greeting

        # Save the updated settings object
        user.update(set__settings=settings)

        return jsonify({"message": "Greeting updated successfully", "greeting": greeting}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@setting.route('/update_weeks', methods=['POST'])
def update_weeks():
    try:
        google_id = get_user_id(session)  # Fetch the user's Google ID
        user = User.objects.get(google_id=google_id)  # Fetch the user object

        # Parse request data
        data = request.json
        weeks = data.get('future_weeks')

        # Access and update the `greeting` field in user settings
        settings = user.settings
        settings['future_weeks'] = weeks

        # Save the updated settings object
        user.update(set__settings=settings)

        return jsonify({"message": "Weeks updated successfully", "future_weeks": weeks}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@setting.route('/add_word', methods=['POST'])
def add_word():
    try:
        google_id = get_user_id(session)  # Fetch the user's Google ID
        user = User.objects.get(google_id=google_id)  # Fetch the user object

        # Access the settings object
        settings = user.settings

        # Parse the request data
        data = request.json
        priority = data.get('priority')  # e.g., 'high', 'medium', or 'low'
        word = data.get('word')

        # Validate input
        if not priority or not word:
            return jsonify({'error': 'Priority and word are required'}), 400

        # Ensure the priority exists in settings.priorities.word_type
        if priority not in settings['priorities']['word_type']:
            return jsonify({'error': f'Invalid priority: {priority}'}), 400

        # Add the word to the corresponding priority list
        settings['priorities']['word_type'][priority].append(word)

        # Save the updated settings object back to the database
        user.update(set__settings=settings)

        # Serialize and return the updated priorities
        updated_priorities = settings['priorities']['word_type']
        return jsonify(json.loads(json_util.dumps(updated_priorities))), 200
    except DoesNotExist:
        return jsonify({'error': "User doesn't exist."}), 404
    except Exception as e:
        current_app.logger.error(f"Error in add_word: {str(e)}")
        return jsonify({'error': str(e)}), 500


@setting.route('/delete_word', methods=['POST'])
def delete_word():
    try:
        google_id = get_user_id(session)
        user = User.objects.get(google_id=google_id)
        settings = user.settings

        # Parse request data
        data = request.json
        priority = data.get('priority')
        word = data.get('word')

        if not priority or not word:
            return jsonify({'error': 'Priority and word are required'}), 400

        # Ensure the word exists before attempting to remove it
        if priority in settings['priorities']['word_type'] and word in settings['priorities']['word_type'][priority]:
            settings['priorities']['word_type'][priority].remove(word)
            user.update(set__settings=settings)
            return jsonify({'message': f'{word} removed from {priority} priority'}), 200

        return jsonify({'error': 'Word not found in priority'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@setting.route('/add_calendar', methods=['POST'])
def add_calendar():
    try:
        google_id = get_user_id(session)  # Fetch the user's Google ID
        user = User.objects.get(google_id=google_id)  # Fetch the user object

        # Access the settings object
        settings = user.settings

        # Parse the request data
        data = request.json
        priority = data.get('priority')  # e.g., 'high', 'medium', or 'low'
        calendar = data.get('calendar')

        # Validate input
        if not priority or not calendar:
            return jsonify({'error': 'Priority and calendar are required'}), 400

        # Ensure the priority exists in settings.priorities.word_type
        if priority not in settings['priorities']['calendar_type']:
            return jsonify({'error': f'Invalid priority: {priority}'}), 400

        # Add the word to the corresponding priority list
        settings['priorities']['calendar_type'][priority].append(calendar)

        # Save the updated settings object back to the database
        user.update(set__settings=settings)

        # Serialize and return the updated priorities
        updated_priorities = settings['priorities']['calendar_type']
        return jsonify(json.loads(json_util.dumps(updated_priorities))), 200
    except DoesNotExist:
        return jsonify({'error': "User doesn't exist."}), 404
    except Exception as e:
        current_app.logger.error(f"Error in add_word: {str(e)}")
        return jsonify({'error': str(e)}), 500


@setting.route('/delete_calendar', methods=['POST'])
def delete_calendar():
    try:
        google_id = get_user_id(session)
        user = User.objects.get(google_id=google_id)
        settings = user.settings

        # Parse request data
        data = request.json
        priority = data.get('priority')
        calendar = data.get('calendar')

        if not priority or not calendar:
            return jsonify({'error': 'Priority and calendar are required'}), 400

        # Ensure the word exists before attempting to remove it
        if priority in settings['priorities']['calendar_type'] and calendar in settings['priorities']['calendar_type'][priority]:
            settings['priorities']['calendar_type'][priority].remove(calendar)
            user.update(set__settings=settings)
            return jsonify({'message': f'{calendar} removed from {priority} priority'}), 200

        return jsonify({'error': 'calendar not found in priority'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@setting.route('/add_color', methods=['POST'])
def add_color():
    try:
        google_id = get_user_id(session)  # Fetch the user's Google ID
        user = User.objects.get(google_id=google_id)  # Fetch the user object

        # Access the settings object
        settings = user.settings

        # Parse the request data
        data = request.json
        priority = data.get('priority')  # e.g., 'high', 'medium', or 'low'
        color = data.get('color')

        # Validate input
        if not priority or not color:
            return jsonify({'error': 'Priority and color are required'}), 400

        # Ensure the priority exists in settings.priorities.word_type
        if priority not in settings['priorities']['color_type']:
            return jsonify({'error': f'Invalid priority: {priority}'}), 400

        # Add the word to the corresponding priority list
        settings['priorities']['color_type'][priority].append(color)

        # Save the updated settings object back to the database
        user.update(set__settings=settings)

        # Serialize and return the updated priorities
        updated_priorities = settings['priorities']['color_type']
        return jsonify(json.loads(json_util.dumps(updated_priorities))), 200
    except DoesNotExist:
        return jsonify({'error': "User doesn't exist."}), 404
    except Exception as e:
        current_app.logger.error(f"Error in add_word: {str(e)}")
        return jsonify({'error': str(e)}), 500


@setting.route('/delete_color', methods=['POST'])
def delete_color():
    try:
        google_id = get_user_id(session)
        user = User.objects.get(google_id=google_id)
        settings = user.settings

        # Parse request data
        data = request.json
        priority = data.get('priority')
        color = data.get('color')

        if not priority or not color:
            return jsonify({'error': 'Priority and color are required'}), 400

        # Ensure the word exists before attempting to remove it
        if priority in settings['priorities']['color_type'] and color in settings['priorities']['color_type'][priority]:
            settings['priorities']['color_type'][priority].remove(color)
            user.update(set__settings=settings)
            return jsonify({'message': f'{color} removed from {priority} priority'}), 200

        return jsonify({'error': 'color not found in priority'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def serialize(obj):
    if hasattr(obj, 'to_mongo'):
        return obj.to_mongo().to_dict()
    elif isinstance(obj, dict):
        return {key: serialize(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize(item) for item in obj]
    elif hasattr(obj, '__dict__'):
        return {key: value for key, value in obj.__dict__.items() if not key.startswith('_')}
    else:
        return obj