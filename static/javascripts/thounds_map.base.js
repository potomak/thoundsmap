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
    
    load: function(thound) {
      ThoundsMap.thoundSound = soundManager.createSound({
        id: 'thound_' + thound.id,
        url: thound.mix_url,
        type: 'audio/mp3',
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
    }
  };
})();