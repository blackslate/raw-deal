;(function puzzleLoaded(puzzle, lx){

  function Puzzle() {
    this.name = "Sequence"
  }

  Puzzle.prototype.initialize = function initialize() {
    var options = {
      cues: [
        { sequence: ["S1", "H1", "D1", "C1"]
        , stories: [
            "A stranger in a suit and hat fed my dodo to the cat"
          , ""
          ]
        }
      , { sequence: ["S1", "S2", "S3", "S4"]
        , stories: [
            "A suit as bright as the sun attacked a sumo in a sari"
          , ""
          ]
        }
      , { sequence: ["H4", "H2", "H3", "H1"]
        , stories: [
            "A hare on a hen's back pulled a ham out of a hat"
          , ""
          ]
        }
      , { sequence: ["C4", "H4", "S4", "D4"]
        , stories: [
            "A car ran over a hare when a sari got caught in the door"
          , ""
          ]
        }
      ]
    , repeatAfter: 0
    , allottedTime: 4000
    , scoreMethod: "updateScore"
    }
    var game = lx.getInstance("Sequence", options)
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