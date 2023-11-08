from models import db, TenSecond, ThirtySecond, SixtySecond, OneTwentySecond
from app import app

db.drop_all()
db.create_all()

TenSecond.query.delete()
ThirtySecond.query.delete()
SixtySecond.query.delete()
OneTwentySecond.query.delete()

ten = TenSecond(wpm=30)
ten2 = TenSecond(wpm=20)
ten3 = TenSecond(wpm=50)
ten4 = TenSecond(wpm=100)
ten5 = TenSecond(wpm=70)

thirty = ThirtySecond(wpm=45)
thirty2 = ThirtySecond(wpm=55)
thirty3 = ThirtySecond(wpm=65)
thirty4 = ThirtySecond(wpm=75)
thirty5 = ThirtySecond(wpm=85)

sixty = SixtySecond(wpm=60)
sixty2 = SixtySecond(wpm=40)
sixty3 = SixtySecond(wpm=50)
sixty4 = SixtySecond(wpm=30)
sixty5 = SixtySecond(wpm=140)

onetwenty = OneTwentySecond(wpm=5)
onetwenty2 = OneTwentySecond(wpm=25)
onetwenty3 = OneTwentySecond(wpm=75)
onetwenty4 = OneTwentySecond(wpm=105)
onetwenty5 = OneTwentySecond(wpm=125)

db.session.add(ten)
db.session.add(ten2)
db.session.add(ten3)
db.session.add(ten4)
db.session.add(ten5)

db.session.add(thirty)
db.session.add(thirty2)
db.session.add(thirty3)
db.session.add(thirty4)
db.session.add(thirty5)

db.session.add(sixty)
db.session.add(sixty2)
db.session.add(sixty3)
db.session.add(sixty4)
db.session.add(sixty5)

db.session.add(onetwenty)
db.session.add(onetwenty2)
db.session.add(onetwenty3)
db.session.add(onetwenty4)
db.session.add(onetwenty5)

db.session.commit()