;(function levelLoaded(level, lx){

  function Level() {
    this.name = "Sequence"
  }

  Level.prototype.initialize = function initialize() {
    var options = {
      cues: getCues()
    , repeatAfter: 0
    , allottedTime: 4000
    , scoreMethod: "updateScore"
    , clearCues: true
    }
    var game = lx.getInstance("Sequence", options)
    game.initialize()

    function getCues() {
      var cues = []
      var cards = [
        "S1", "S2", "S3", "S4", "S5"
      , "H1", "H2", "H3", "H4", "H5"
      , "D1", "D2", "D3", "D4", "D5"
      , "C1", "C2", "C3", "C4", "C5"
      ]

      var total = 32
      var count = 4
      var ii
        , sequence
      
      for (ii = 0; ii < total; ii += 1) {
        sequence = []
         
        for (jj = 0; jj < count; jj += 1) {
          sequence.push(lx.randomItemFromArray(cards, 4))
        }

        cues.push({ 
          sequence: sequence
        , stories: [] // TO DO
        })
      }

      return cues
    }
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