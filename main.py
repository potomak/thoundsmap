#!/usr/bin/env python

import os
import logging
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch
from google.appengine.ext import db
from django.utils import simplejson
from GeotaggedThound import GeotaggedThound
import random
from datetime import datetime

API_ENDPOINT = "http://thounds.local:3000"


class MainHandler(webapp.RequestHandler):
    def get(self):
        result = urlfetch.fetch(url=API_ENDPOINT + "/thounds/public_stream",
                                headers={'Accept': 'application/json'},
                                deadline=10)
                                
        if result.status_code == 200:
          thounds = simplejson.loads(result.content)['thounds-collection']['thounds']
        
        logging.debug(thounds)
        
        for thound in thounds:
            geotagged_thound = GeotaggedThound()

            if thound['tracks'][0]['lat']:
                geotagged_thound.location = db.GeoPt(thound['tracks'][0]['lat'], thound['tracks'][0]['lng'])
            else:
                geotagged_thound.location = db.GeoPt(random.uniform(45, 46), random.uniform(12, 13))
            
            geotagged_thound.created_at = datetime.strptime(thound['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            geotagged_thound.data = simplejson.dumps(thound)
            geotagged_thound.put()
        
        template_values = {
            'title': 'Thounds Map',
            'thounds': thounds
        }

        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))


class GetThoundsHandler(webapp.RequestHandler):
    def get(self):
        geotagged_thounds = db.GqlQuery("SELECT * FROM GeotaggedThound")
        
        logging.debug("Yo BRO!")
        logging.debug(list(geotagged_thounds))
        
        self.response.out.write(geotagged_thounds)


def main():
    # Set the logging level in the main function
    # See the section on Requests and App Caching for information on how
    # App Engine reuses your request handlers when you specify a main function
    logging.getLogger().setLevel(logging.DEBUG)
        
    application = webapp.WSGIApplication([('/', MainHandler),
                                          ('/get', GetThoundsHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
