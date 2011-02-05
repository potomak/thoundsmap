ThoundsMap.ui = (function() {
  return {
    controls: (function() {
      return {
        play: function(thound_id) {
          console.log("play: " + thound_id);
          ThoundsMap.load(thound_id);
        },
        stop: function() {
          console.log("stop");
        }
      };
    })(),
    
    createBubble: function(thound_id) {
      html_string = "<div class='player'>"
                  + "<div class='title'>" + thounds[thound_id].tracks[0].title + "</div>"
                  + "<a class='play' onclick='ThoundsMap.ui.controls.play(" + thound_id + ")'>Play</a>"
                  + "<div class='progress_wrapper'>"
                  + "<div class='loading'></div>"
                  + "<div class='playing'></div>"
                  + "</div>"
                  + "</div>";
      
      return html_string;
    }
  };
})();