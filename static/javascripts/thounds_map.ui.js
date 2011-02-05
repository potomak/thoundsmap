ThoundsMap.ui = (function() {
  return {
    controls: (function() {
      return {
        play: function(thound_id) {
          console.log("play: " + thound_id);
          ThoundsMap.load(thound_id);
          $("#thound_" + thound_id + " .play").hide();
          $("#thound_" + thound_id + " .stop").show();
        },
        stop: function() {
          console.log("stop");
          $("#thound_" + thound_id + " .stop").hide();
          $("#thound_" + thound_id + " .play").show();
        }
      };
    })(),
    
    loading: (function() {
      return {
        progress: function(percentage, thound_id) {
          $("#thound_" + thound_id + " .loading").css('width', percentage + '%');
        }
      };
    })(),
    
    playing: (function() {
      return {
        progress: function(percentage, thound_id) {
          $("#thound_" + thound_id + " .playing").css('width', percentage + '%');
        }
      };
    })(),
    
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
    }
  };
})();