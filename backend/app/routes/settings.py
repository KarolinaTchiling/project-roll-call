from app.services.auth_service.token import get_user_id
from app.services.user_settings import get_user_settings, update_user_nonevent_setting, update_user_event_setting
from flask import session, request, jsonify
from . import setting
import json

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


@setting.route("/update_nonevent_setting", methods=['POST'])
def update_nonevent_setting():
    try:
        google_id = get_user_id(session)
        setting_key = request.json.get("setting_key")
        new_value = request.json.get("new_value")

        if "new_value" not in request.json:
            return jsonify({"error": "new_value required"}), 400
        if not google_id:
            return jsonify({"error": "google_id required"}), 400
        if not setting_key:
            return jsonify({"error": "setting_key required"}), 400
        

        return update_user_nonevent_setting(google_id, setting_key, new_value)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@setting.route("/update_event_setting", methods=['POST'])
def update_event_setting():
    try:
        google_id = get_user_id(session)
        setting_key = request.json.get("setting_key")
        field_key = request.json.get("field_key")
        new_value = request.json.get("new_value")

        if not google_id:
            return jsonify({"error": "google_id required"}), 400
        if not setting_key:
            return jsonify({"error": "setting_key required"}), 400
        if not new_value:
            return jsonify({"error": "new_value required"}), 400

        return update_user_event_setting(google_id, setting_key, field_key, new_value)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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