#!/usr/bin/env python

import os
import logging
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch
from django.utils import simplejson


class MainHandler(webapp.RequestHandler):
    def get(self):
        result = urlfetch.fetch(url="http://thounds.com/thounds/public_stream",
                                headers={'Accept': 'application/json'})
        if result.status_code == 200:
          thounds = simplejson.loads(result.content)['thounds-collection']['thounds']
        
        logging.debug(thounds)
        
        template_values = {
            'title': 'Thounds Map',
            'thounds': thounds
        }

        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))


def main():
    # Set the logging level in the main function
    # See the section on Requests and App Caching for information on how
    # App Engine reuses your request handlers when you specify a main function
    logging.getLogger().setLevel(logging.DEBUG)
        
    application = webapp.WSGIApplication([('/', MainHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
