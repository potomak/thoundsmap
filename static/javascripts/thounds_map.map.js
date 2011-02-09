var markers = {};
var thounds = {};
var map;

var components_collection = [
  new ovi.mapsapi.map.component.Behavior(), //behavior collection 
  new ovi.mapsapi.map.component.ZoomBar(),
  new ovi.mapsapi.map.component.Overview(),
  new ovi.mapsapi.map.component.TypeSelector(),
  new ovi.mapsapi.map.component.ScaleBar()
];

var infobubbles = new ovi.mapsapi.map.component.InfoBubbles();

var venice = [45.4375, 12.335833];

ThoundsMap.map = (function () {
  return {
    createBubble: function(thound_id) {
      html_string = "<div class='player' id='thound_" + thound_id + "'>"
                  + "<div class='title'>" + thounds[thound_id].tracks[0].title + "</div>"
                  + "<div class='controls_wrapper'>"
                  + "<a class='play' onclick='ThoundsMap.ui.controls.play(" + thound_id + ")'>Play</a>"
                  + "<a class='stop' onclick='ThoundsMap.ui.controls.stop(" + thound_id + ")' style='display: none'>Stop</a>"
                  + "</div>"
                  + "<div class='progress_wrapper'>"
                  + "<div class='loading'></div>"
                  + "<div class='playing'></div>"
                  + "</div>"
                  + "</div>";
      
      return html_string;
    },
    
    markerClickCallback: function(thound_id) {
      infobubbles.addBubble(
        ThoundsMap.map.createBubble(thound_id),
        new ovi.mapsapi.geo.Coordinate(lat, lng)
      );
    }
  };
})();

function put_marker(thound, lat, lng) {
  if (!markers[thound.id]) {
    var m = new ovi.mapsapi.map.Marker(
      new ovi.mapsapi.geo.Coordinate(lat, lng), {
        title: "marker",
        visibility: true,
        icon: "/images/thounds_pin.png",
        anchor: new ovi.mapsapi.util.Point(16, 16),
        eventListener: {
          click: function(event) { ThoundsMap.map.markerClickCallback(thound.id); },
          tap: function(event) { ThoundsMap.map.markerClickCallback(thound.id); }
        }
      }
    );

    map.objects.add(m);
    markers[thound.id] = m;
    thounds[thound.id] = thound;
  }
}

function updater(data, success) {
  for (id in markers) {
    map.objects.remove(markers[id]);
  }
  markers = {};
  thounds = {};
  if (data) {
    for (x in data) {
      if (data[x].tracks[0].lat != null) {
        put_marker(data[x], data[x].tracks[0].lat, data[x].tracks[0].lng);
      }
    }
  }
}

function display_thounds(evt) {
  var bbox = map.getViewBounds();
  var qs = "tl_lat=" + bbox.topLeft.latitude + "&tl_lng=" + bbox.topLeft.longitude + "&br_lat=" + bbox.bottomRight.latitude + "&br_lng=" + bbox.bottomRight.longitude;
  $.ajax ({
    type: "GET",
    url: "/get_thounds?" + qs,
    dataType: "json",
    cache: false, //VITAL line: the getJON func does not prevent caching!
    success: function(data, success) {
      updater(data, success);
    }
  });
}

function init_map() {
  map = new ovi.mapsapi.map.Display(document.getElementById("map"), {
    components: components_collection,
    zoomLevel: 10, //zoom level for the map
    center: venice //center coordinates
  });
  
  map.addObserver("zoomLevel", function(obj, key, new_value, old_value) {
    display_thounds(null);
  });
  
  if (ovi.mapsapi.positioning.Manager) {
    var positioning = new ovi.mapsapi.positioning.Manager();
    positioning.getCurrentPosition(
      function(position) {
        var coords = position.coords;
        //var marker = new ovi.mapsapi.map.StandardMarker(coords);

        var marker = new ovi.mapsapi.map.Marker(
          new ovi.mapsapi.geo.Coordinate(coords.latitude, coords.longitude), {
            title: "position",
            visibility: true,
            icon: "/images/youarehere.png",
            anchor: new ovi.mapsapi.util.Point(26, 82),
            eventListener: {}
          }
        );

        var accuracyCircle = new ovi.mapsapi.map.Circle(coords, coords.accuracy);
        map.objects.addAll([accuracyCircle, marker]);
        map.setAttributes ("default", coords, 7, null, null);
        //map.zoomTo(accuracyCircle.getBoundingBox(), false, "default");
        //if (MAP1.zoomLevel > 16) MAP1.set("zoomLevel", 16); //zoom out if too close
      }
    );
  }
  
  //remove zoom.MouseWheel behavior for better page scrolling experience
  //map.removeComponent(map.getComponentById("zoom.MouseWheel"));
  map.components.add(infobubbles);
  
  map.addListener("dragend", display_thounds, false);
  display_thounds(null);
}