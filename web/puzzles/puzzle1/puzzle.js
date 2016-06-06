;(function puzzleLoaded(lx){

  function Puzzle() {
    this.name = "Aces and Hearts"
  }

  Puzzle.prototype.initialize = function initialize() {
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

  Puzzle.prototype.kill = function kill() {
    // Clean up when puzzle is about to be replaced
  }

  if (typeof lx.puzzle.hash === "string") {
    if (typeof lx.puzzle.map === "object") {
      var object = lx.puzzle.map[lx.puzzle.hash] = new Puzzle()
    }
  }
})(lexogram) // <HARD-CODED global object>