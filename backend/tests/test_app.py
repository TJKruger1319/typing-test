import os
from unittest import TestCase
from models import db, connect_db, User, TestResult
from flask import json

os.environ['DATABASE_URL'] = "postgressql:///alarm-test"

from app import app
class AppTestCode(TestCase):
    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_add_typing_test_route(self):
        # Test the add_typing_test route
        test_data = {
            'username': 'test_user',
            'wpm': 80,
            'test_duration': 30
        }

        response = self.client.post('/add_typing_test', json=test_data)
        data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Typing test result added successfully')
        self.assertIn('user_id', data)

    def test_get_typing_stats_route(self):
        # Test the get_typing_stats route
        test_user = User(username='test_user')
        test_result = TestResult(wpm=75, test_duration=30, user=test_user)

        db.session.add(test_user)
        db.session.add(test_result)
        db.session.commit()

        response = self.client.get('/typing_stats/30')
        data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertIn('highest_score', data)
        self.assertIn('average_score_first_100', data)

    def test_update_username_route(self):
        # Test the update_username route
        test_user = User(username='old_username')
        db.session.add(test_user)
        db.session.commit()

        response = self.client.patch('/update_username/1', json={'new_username': 'new_username'})
        data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Username updated to new_username successfully')



        