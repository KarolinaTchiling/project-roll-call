from ..services.report_service.email_service import gmail_send_message
from . import report
from flask import session, request, jsonify
from app.services.auth_service.token import get_user_id



@report.route("/share", methods=['GET'])
def share_report():
    try:
        google_id = get_user_id(session)  # Get the user's Google ID
        recipient = request.args.get("recipient")  # Get recipient from query parameters

        if not recipient:
            return jsonify({"error": "Recipient email is required"}), 400

        gmail_send_message(recipient, google_id) 
        return jsonify({"message": "Report shared successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




   