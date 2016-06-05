;(function puzzleLoaded(puzzle, lx){

  function Puzzle() {
    this.name = "Twos to Fours"
  }

  Puzzle.prototype.initialize = function initialize() {
    var options = {
      cues: [
        "S2", "S3", "S4"
      , "D2", "D3", "D4"
      , "C2", "C3", "C4"
      ]     
      , allottedTime: 3000
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
})(window.puzzle, lexogram) // <HARD-CODED global object>