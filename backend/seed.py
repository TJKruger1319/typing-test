from models import db, TenSecond, ThirtySecond, SixtySecond, OneTwentySecond, Highest10, Highest30, Highest60, Highest120
from app import app

db.drop_all()
db.create_all()

TenSecond.query.delete()
ThirtySecond.query.delete()
SixtySecond.query.delete()
OneTwentySecond.query.delete()

ten = TenSecond(wpm=30)
ten2 = TenSecond(wpm=20)
ten3 = TenSecond(wpm=10)
ten4 = TenSecond(wpm=15)
ten5 = TenSecond(wpm=14)

thirty = ThirtySecond(wpm=25)
thirty2 = ThirtySecond(wpm=15)
thirty3 = ThirtySecond(wpm=10)
thirty4 = ThirtySecond(wpm=16)
thirty5 = ThirtySecond(wpm=26)

sixty = SixtySecond(wpm=14)
sixty2 = SixtySecond(wpm=10)
sixty3 = SixtySecond(wpm=20)
sixty4 = SixtySecond(wpm=17)
sixty5 = SixtySecond(wpm=14)

onetwenty = OneTwentySecond(wpm=5)
onetwenty2 = OneTwentySecond(wpm=25)
onetwenty3 = OneTwentySecond(wpm=32)
onetwenty4 = OneTwentySecond(wpm=15)
onetwenty5 = OneTwentySecond(wpm=26)

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

ten_title = Highest10(title="Billy")
thirty_title = Highest30(title="The Typing King")
sixty_title = Highest60(title="legend")
onetwenty_title = Highest120(title="StaminaHead")

db.session.add(ten_title)
db.session.add(thirty_title)
db.session.add(sixty_title)
db.session.add(onetwenty_title)

db.session.commit()