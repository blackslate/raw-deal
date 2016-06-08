;(function levelLoaded(level, lx){

  function Level() {
    this.name = "Twos to Fours"
  }

  Level.prototype.initialize = function initialize() {
    var options = {
      cues: [
        "S2", "S3", "S4"
      , "D2", "D3", "D4"
      , "C2", "C3", "C4"
      ]     
    , allottedTime: 4000
    , scoreMethod: "updateScore"
    }
    var game = lx.getInstance("CardMatch", options)
    game.initialize()
  }

  Level.prototype.kill = function kill() {
    // Clean up when level is about to be replaced
  }

  if (typeof lx.level.hash === "string") {
    if (typeof lx.level.map === "object") {
      var object = lx.level.map[lx.level.hash] = new Level()
    }
  }
})(window.level, lexogram) // <HARD-CODED global object>