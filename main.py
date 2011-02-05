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


class MainHandler(webapp.RequestHandler):
    def get(self):
        thounds = []
        
        template_values = {
            'title': 'Thounds Map',
            'thounds': thounds
        }

        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))


class GetThoundsHandler(webapp.RequestHandler):
    def get(self):
        geotagged_thounds = db.GqlQuery("SELECT * FROM GeotaggedThound WHERE location > GEOPT(:tl_lat, :tl_lng) AND location < GEOPT(:br_lat, :br_lng)", tl_lat=self.request.get('tl_lat'), tl_lng=self.request.get('tl_lng'), br_lat=self.request.get('br_lat'), br_lng=self.request.get('br_lng'))
        
        logging.debug("GetThoundsHandler num:")
        logging.debug(len(list(geotagged_thounds)))
        
        response_body = "["
        for thound in geotagged_thounds:
            response_body += thound.data + ","
        response_body += "]"
        
        self.response.out.write(response_body)
        
        
class GetThoundsTempList(webapp.RequestHandler):
    def get(self):
        self.response.out.write(simplejson.dumps({'some': [self.request.get('tl_lat'), self.request.get('tl_lng'), self.request.get('br_lat'), self.request.get('br_lng')]}))


class RunScriptHandler(webapp.RequestHandler):
    def get(self):
        import re
        
        f = open('thounds.js')
        thounds = simplejson.loads(f.read())['thounds-collection']['thounds']

        self.response.out.write(len(thounds))

        geotagged = []

        for thound in thounds:
            if thound['tracks'][0]['lat']:
                geotagged.append(thound)

        self.response.out.write(len(geotagged))

        for thound in geotagged:
            geotagged_thound = GeotaggedThound()

            geotagged_thound.location = db.GeoPt(thound['tracks'][0]['lat'], thound['tracks'][0]['lng'])
            if "Z" in thound['created_at']:
                geotagged_thound.created_at = datetime.strptime(re.sub("Z", "", thound['created_at']), "%Y-%m-%dT%H:%M:%S")
            else:
                geotagged_thound.created_at = datetime.strptime(re.sub("\+(\d+):(\d+)", "", thound['created_at']), "%Y-%m-%dT%H:%M:%S")
            geotagged_thound.data = simplejson.dumps(thound)
            geotagged_thound.put()

        self.response.out.write("done!")


def main():
    # Set the logging level in the main function
    # See the section on Requests and App Caching for information on how
    # App Engine reuses your request handlers when you specify a main function
    logging.getLogger().setLevel(logging.DEBUG)
        
    application = webapp.WSGIApplication([('/', MainHandler),
                                          ('/get_thounds', GetThoundsHandler),
                                          ('/getthounds', GetThoundsTempList),
                                          ('/run_script', RunScriptHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
