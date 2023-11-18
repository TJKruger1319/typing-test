from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    # Connect to a database
    db.app = app
    db.init_app(app)

class TenSecond(db.Model):
    """Ten Second"""

    __tablename__ = "ten_seconds"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    wpm = db.Column(db.Integer, nullable=False)


class ThirtySecond(db.Model):
    """Thirty Second"""

    __tablename__ = "thirty_seconds"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    wpm = db.Column(db.Integer, nullable=False)

class SixtySecond(db.Model):
    """Sixty Second"""

    __tablename__ = "sixty_seconds"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    wpm = db.Column(db.Integer, nullable=False)

class OneTwentySecond(db.Model):
    """One Twenty Second"""

    __tablename__ = "one_twenty_seconds"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    wpm = db.Column(db.Integer, nullable=False)

class Highest10(db.Model):

    __tablename__ = "highest_10"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)

class Highest30(db.Model):

    __tablename__ = "highest_30"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)

class Highest60(db.Model):

    __tablename__ = "highest_60"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)

class Highest120(db.Model):

    __tablename__ = "highest_120"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)



