var ThoundsMap = (function () {
  return {
    thoundSound: null,
    
    onReady: function(success) {
      if(success) {
        console.log("Thounds radio is ready!");
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
          ThoundsMap.ui.loading.progress(percentage);
        },
        whileplaying: function() {
          realDuration = (this.duration * this.bytesTotal) / this.bytesLoaded;
          percentage = (this.position / realDuration) * 100;
          ThoundsMap.ui.playing.progress(percentage);
        },
        onfinish: function() {
          console.log("Song complete...");
        },
        onplay: function() {
          console.log("Song playing...");
        }
      });
    },
    
    stop: function() {
      if(ThoundsMap.thoundSound) {
        console.log("Stop (ThoundsRadio.thoundSound.playState: " + ThoundsRadio.thoundSound.playState);
        ThoundsMap.thoundSound.destruct();
      }
      ThoundsMap.ui.loading.complete();
      return true;
    }
  };
})();