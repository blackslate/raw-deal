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
        "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13"
      , "H6", "H7", "H8", "H9", "H10", "H11", "H12", "H13"
      , "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13"
      , "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13"
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