;(function levelLoaded(lx){

  function Level() {
    this.name = "Aces and Hearts"
  }

  Level.prototype.initialize = function initialize() {
    var options = {
      cues: [
        "S1"
      , "H1", "H2", "H3", "H4", "H5"
      , "D1"
      , "C1"
      ]
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
})(lexogram) // <HARD-CODED global object>