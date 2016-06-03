// window.puzzle = {
//   map: {}
// , hash: "test"
// , completed: function () { console.log("Puzzle completed") }
// }

// setTimeout(function () {
//   window.puzzle.map.test.initialize()
// }, 0)

// function getClientLoc(event) {
//   var clientLoc = {}
//   if (isNaN(event.clientX)) {          
//     clientLoc.x = event.targetTouches[0].clientX
//     clientLoc.y = event.targetTouches[0].clientY
//   } else {          
//     clientLoc.x = event.clientX
//     clientLoc.y = event.clientY
//   }

//   return clientLoc
// }

/*********** REMOVE ALL CODE ABOVE THIS LINE IN PRODUCTION **********/

;(function puzzleLoaded(puzzle){

  function Puzzle() {
    this.name = "Template"
  }

  Puzzle.prototype.initialize = function initialize() {
    console.log("Puzzle '" + this.name + "' initialized")
    // Code goes here
    
    puzzle.completed(puzzle.hash)
  }

  Puzzle.prototype.kill = function kill() {
    // Clean up when puzzle is about to be replaced
  }

  if (typeof puzzle.hash === "string") {
    if (typeof puzzle.map === "object") {
      var object = puzzle.map[puzzle.hash] = new Puzzle()
    }
  }
})(window.puzzle) // <HARD-CODED global object>