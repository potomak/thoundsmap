from google.appengine.ext import db

class GeotaggedThound(db.Model):
    location = db.GeoPtProperty()
    created_at = db.DateTimeProperty()
    data = db.TextProperty()