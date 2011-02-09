ThoundsMap.ui = (function() {
  return {
    controls: (function() {
      return {
        play: function(thound_id) {
          //console.log("play: " + thound_id);
          ThoundsMap.load(thound_id);
          $("#thound_" + thound_id + " .play").hide();
          $("#thound_" + thound_id + " .stop").show();
        },
        stop: function(thound_id) {
          //console.log("stop");
          ThoundsMap.stop();
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
    })()
  };
})();