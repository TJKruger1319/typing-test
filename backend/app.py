from flask import Flask, jsonify, request, make_response
from models import db, connect_db, TenSecond, ThirtySecond, SixtySecond, OneTwentySecond
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///typingtests'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "temp"

app.app_context().push()
connect_db(app)

@app.route("/average/<int:time>")
def get_average(time):
    """ Gets the average for each entry in the chosen test"""
    if time == 10:
        scores = TenSecond.query.all()
    elif time == 30:
        scores = ThirtySecond.query.all()
    elif time == 60:
        scores = SixtySecond.query.all()
    elif time == 120:
        scores = OneTwentySecond.query.all()
    else:
        return make_response(jsonify({"error": "Path not found"}), 500)
    total = 0
    for s in scores:
        total = total + s.wpm
    average = total/len(scores)
    return jsonify({'average': int(average)})

@app.route("/add/<time>", methods=["POST"])
def add_score(time):
    """ Adds a new wpm test score to the database in the user's chosen test"""
    try:
        response = request.json
        wpm = response['wpm']
        if time == "10":
            new_score = TenSecond(wpm=wpm)
        elif time == "30":
            new_score = ThirtySecond(wpm=wpm)
        elif time == "60":
            new_score = SixtySecond(wpm=wpm)
        elif time == "120":
            new_score = OneTwentySecond(wpm=wpm)
        else:
            return make_response(jsonify({"error": "Path not found"}), 500)
        db.session.add(new_score)
        db.session.commit()
        return make_response(jsonify({"message": "Score successfully added", "id": new_score.id}), 200)
    except Exception as e:
        return make_response(jsonify({"error": str(e)}), 500)