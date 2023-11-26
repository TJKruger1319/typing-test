from flask import Flask, jsonify, request
from models import db, connect_db, TestResult, User
from flask_cors import CORS
from sqlalchemy import func
import os

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.app_context().push()
connect_db(app)
db.create_all()

@app.route('/statistics/<int:test_duration>', methods=['GET'])
def get_typing_stats(test_duration):
    try:
        # Query to get the highest score and the username of the person who got the highest score
        highest_score_query = (
            db.session.query(TestResult.wpm, User.username)
            .join(User)
            .filter(TestResult.test_duration == test_duration)
            .order_by(TestResult.wpm.desc())
            .first()
        )

        if not highest_score_query:
            raise ValueError("No results found for that test duration.")

        # Query to get the average of the first 100 scores for the specified test duration
        average_score_query = (
            db.session.query(func.avg(TestResult.wpm))
            .filter(TestResult.test_duration == test_duration)
            .limit(100)
            .scalar()
        )

        average_wpm = int(average_score_query) if average_score_query is not None else None

        highest_score = {
            'wpm': highest_score_query[0],
            'username': highest_score_query[1]
        }

        return jsonify({
            'highest_score': highest_score,
            'average_score': average_wpm
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Internal Server Error

@app.route("/add/<int:test_duration>", methods=["POST"])
def add_score(test_duration):
    """ Adds a new wpm test score to the database of the chosen test type"""
    try:
        # Assuming the request data is in JSON format with keys 'username', 'wpm', and 'test_duration'
        data = request.json

        # Extract data from the request
        username = data['username']
        wpm = data['wpm']

        # Check if the user is specified in the request
        if username:
            user = User.query.filter_by(username=username).first()

            # If the user doesn't exist, create a new user
            if not user:
                user = User(username=username)
                db.session.add(user)
                db.session.commit()
        else:
            # If the user is not specified, create an anonymous user
            user = User(username='Anonymous')
            db.session.add(user)
            db.session.commit()

        # Add a new typing test result
        test_result = TestResult(wpm=wpm, test_duration=test_duration, user=user)
        db.session.add(test_result)
        db.session.commit()

        # Return the user_id along with a success message
        return jsonify({
            'message': 'Typing test result added successfully',
            'user_id': user.id
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Internal Server Error

@app.route('/update_username/<int:user_id>', methods=['PATCH'])
def update_username(user_id):
    try:
        # Find the user by user_id
        user = User.query.get(user_id)

        if not user:
            raise ValueError("User not found.")

        # Get the new username from the request data
        response = request.json
        new_username = response["new_username"]

        if not new_username:
            raise ValueError("New username not provided in the request.")

        # Update the username
        user.username = new_username
        db.session.commit()

        return jsonify({'message': f'Username updated to {new_username} successfully'})

    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400  # Bad Request
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Internal Server Error