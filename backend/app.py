from flask import Flask, jsonify, request, make_response
from models import db, connect_db, TenSecond, ThirtySecond, SixtySecond, OneTwentySecond, Highest10, Highest30, Highest60, Highest120
from flask_cors import CORS
from helper import biggestValue

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///typingtests'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "temp"

app.app_context().push()
connect_db(app)

@app.route("/statistics/<int:time>")
def get_statistics(time):
    """ Gets the average for each entry in the chosen test"""
    if time == 10:
        scores = TenSecond.query.all()
        high_score = Highest10.query.first()
    elif time == 30:
        scores = ThirtySecond.query.all()
        high_score= Highest30.query.first()
    elif time == 60:
        scores = SixtySecond.query.all()
        high_score = Highest60.query.first()
    elif time == 120:
        scores = OneTwentySecond.query.all()
        high_score = Highest120.query.first()
    else:
        return make_response(jsonify({"error": "Path not found"}), 500)
    title = high_score.title
    highest = biggestValue(scores)
    total = 0
    for s in scores:
        total = total + s.wpm
    average = total/len(scores)
    return jsonify({'average': int(average), 'highest': highest, 'title': title})

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
    
@app.route("/high_score/<time>", methods=["POST"])
def new_high_score(time):
    """ Adds a new wpm test score to the database in the user's chosen test"""
    try:
        response = request.json
        title = response['newTitle']
        print(title, "******************")
        if time == "10":
            old_title = Highest10.query.filter_by(id=1)
        elif time == "30":
            old_title = Highest30.query.filter_by(id=1)
        elif time == "60":
            old_title = Highest60.query.filter_by(id=1)
        elif time == "120":
            old_title = Highest120.query.filter_by(id=1)
        else:
            return make_response(jsonify({"error": "Path not found"}), 500)
        print(old_title, "**********************")
        old_title.update({'title': title})
        db.session.commit()
        return make_response(jsonify({"message": "Title successfully added", "title": title}), 200)
    except Exception as e:
        return make_response(jsonify({"error": str(e)}), 500)