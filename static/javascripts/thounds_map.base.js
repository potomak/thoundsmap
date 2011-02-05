var ThoundsMap = (function () {
  return {
    thoundSound: null,
    
    onReady: function(success) {
      if(success) {
        console.log("SM2 is ready!");
        
        init_map();
      }
      else {
        console.log("Some errors occur during initialization!");
      }
    },
    
    load: function(thound_id) {
      var thound = thounds[thound_id];
      
      ThoundsMap.thoundSound = soundManager.createSound({
        id: 'thound_' + thound.id,
        url: thound.mix_url,
        type: 'audio/mp3',
        autoLoad: true,
        autoPlay: true,
        onload: function() {
          console.log(this.loaded ? "Song loading complete..." : "Song loading failure...");
        },
        whileloading: function() {
          percentage = (this.bytesLoaded / this.bytesTotal) * 100;
          ThoundsMap.ui.loading.progress(percentage, thound_id);
        },
        whileplaying: function() {
          realDuration = (this.duration * this.bytesTotal) / this.bytesLoaded;
          percentage = (this.position / realDuration) * 100;
          ThoundsMap.ui.playing.progress(percentage, thound_id);
        },
        onfinish: function() {
          console.log("Song complete...");
          ThoundsMap.ui.controls.stop(thound_id);
        },
        onplay: function() {
          console.log("Song playing...");
        }
      });
    },
    
    stop: function() {
      if(ThoundsMap.thoundSound) {
        console.log("Stop (ThoundsRadio.thoundSound.playState: " + ThoundsMap.thoundSound.playState);
        ThoundsMap.thoundSound.destruct();
      }
      //ThoundsMap.ui.loading.complete();
      return true;
    }
  };
})();