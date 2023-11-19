import os
from unittest import TestCase
from models import db, connect_db, TenSecond, ThirtySecond, SixtySecond, OneTwentySecond, Highest10, Highest30, Highest60, Highest120
from flask import json

os.environ['DATABASE_URL'] = "postgressql:///alarm-test"

from app import app

db.create_all()

def checkJson(s):
    try:
        json.decode(s)
        return True
    except json.JSONDecodeError:
        return False

class AppTestCode(TestCase):
    def setUp(self):
        TenSecond.query.delete()
        ThirtySecond.query.delete()
        SixtySecond.query.delete()
        OneTwentySecond.query.delete()
        Highest10.query.delete()
        Highest30.query.delete()
        Highest60.query.delete()
        Highest120.query.delete()

        tenS = TenSecond(wpm=30)
        thirtyS = ThirtySecond(wpm=30)
        sixtyS = SixtySecond(wpm=30)
        onetwentyS = OneTwentySecond(wpm=30)

        tenH = Highest10(title="ten winner")
        thirtyH = Highest30(title="thirty winner")
        sixtyH = Highest60(title="sixty winner")
        onetwentyH = Highest120(title="one twenty winner")

        db.session.add(tenS)
        db.session.add(thirtyS)
        db.session.add(sixtyS)
        db.session.add(onetwentyS)
        db.session.add(tenH)
        db.session.add(thirtyH)
        db.session.add(sixtyH)
        db.session.add(onetwentyH)
        db.session.commit()

    def tearDown(self):
        db.session.rollback()

    def test_statistics(self):
        with app.test_client() as client:
            ten = client.get("/statistics/10")
            ten_data = checkJson(ten.get_data(as_text=True))

            thirty = client.get("/statistics/30")
            thirty_data = checkJson(thirty.get_data(as_text=True))

            sixty = client.get("/statistics/60")
            sixty_data = checkJson(sixty.get_data(as_text=True))

            onetwenty = client.get("/statistics/120")
            onetwenty_data = checkJson(onetwenty.get_data(as_text=True))

            fake = client.get("/statistics/aw0pifhnawoifgn")
            fake_data = checkJson(fake.get_data(as_text=True))

            if ten_data or thirty_data or sixty_data or onetwenty_data or not fake_data:
                raise Exception("Does not properly get data in JSON format")

    def test_add_score(self):
        with app.test_client() as client:
            resp = client.post("/add/10", data={'wpm':25})
            self.assertEqual(resp.status_code, 200)

            ten = TenSecond.query.all()
            self.assertEqual(len(ten), 2)

            resp = client.post("/add/30", data={'wpm':25})
            self.assertEqual(resp.status_code, 200)

            thirty = ThirtySecond.query.all()
            self.assertEqual(len(thirty), 2)

            resp = client.post("/add/60", data={'wpm':25})
            self.assertEqual(resp.status_code, 200)

            sixty = SixtySecond.query.all()
            self.assertEqual(len(sixty), 2)

            resp = client.post("/add/120", data={'wpm':25})
            self.assertEqual(resp.status_code, 200)

            onetwenty = OneTwentySecond.query.all()
            self.assertEqual(len(onetwenty), 2)

    def test_new_high_score(self):
        with app.test_client() as client:
            resp = client.post("/high_score/10", data={'title':"10 winner"})
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.title, "10 winner")

            resp = client.post("/high_score/30", data={'title':"30 winner"})
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.title, "30 winner")

            resp = client.post("/high_score/60", data={'title':"60 winner"})
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.title, "60 winner")

            resp = client.post("/high_score/120", data={'title':"120 winner"})
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.title, "120 winner")




        