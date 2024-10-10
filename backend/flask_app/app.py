from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["appDB"]
users = db["users"]

@app.route("/api/data", methods=['GET'])
def get_data():
    data = list(db.users.find())
    for item in data:
        item['_id'] = str(item['_id'])
    return jsonify(data)

@app.route("/api/data", methods=['POST'])
def post_data():
    new_data = request.json
    db.users.insert_one(new_data)
    new_data['_id'] = str(new_data['_id'])
    return jsonify(new_data), 201

if __name__ == "__main__":
    app.run(debug = True)