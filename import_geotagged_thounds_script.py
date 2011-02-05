from django.utils import simplejson
from GeotaggedThound import GeotaggedThound
from datetime import datetime
import re

f = open('thounds.js')
thounds = simplejson.loads(f.read())['thounds-collection']['thounds']

print len(thounds)

geotagged = []

for thound in thounds:
    if thound['tracks'][0]['lat']:
        geotagged.append(thound)

print len(geotagged)

for thound in geotagged:
    geotagged_thound = GeotaggedThound()

    geotagged_thound.location = db.GeoPt(thound['tracks'][0]['lat'], thound['tracks'][0]['lng'])
    if "Z" in thound['created_at']:
        geotagged_thound.created_at = datetime.strptime(re.sub("Z", "", thound['created_at']), "%Y-%m-%dT%H:%M:%S")
    else:
        geotagged_thound.created_at = datetime.strptime(re.sub("\+(\d+):(\d+)", "", thound['created_at']), "%Y-%m-%dT%H:%M:%S")
    geotagged_thound.data = simplejson.dumps(thound)
    geotagged_thound.put()

print "done!"