;(function puzzleLoaded(puzzle, lx){

  function Puzzle() {
    this.name = "34 Images"
  }

  Puzzle.prototype.initialize = function initialize() {
    var STORAGE_NAME = "random17"
    var suits = ["S", "H", "D", "C"]
    var cues = []
    var exclude
    var options
    var game

    try {
      exclude = JSON.parse(localStorage[STORAGE_NAME])
    } catch(error) {}

    if (!exclude) {
      exclude = getRandom17()
      localStorage[STORAGE_NAME] = JSON.stringify(cues)
    }

    ;(function (){
      var suitCount = suits.length
       var suit
        , number
        , card
      
      for (suit = 0; suit < suitCount; suit += 1) {
        for (number = 5; number < 14; number += 1) {
          card = suits[suit] + number
          if (exclude.indexOf(card) < 0){
            cues.push(card)
          }
        }    
      }
    })()

    options = {
      cues: cues
    , allottedTime: 3000
    , scoreMethod: "updateScore"
    , repeatAfter: 10
    }
    game = lx.getInstance("ImageMatch", options)
    game.initialize()

    function getRandom17() {
      var random17 = []   
      var duplicate = 0
      var random

      numbers = [5,6,7, 8,9,10, 11,12,13] // 9 items  

      numbers.push.apply(numbers, numbers) // 18 items
      random = Math.floor(Math.random() * numbers.length) // 0 - 17
      numbers.splice(random, 1) // 17 items

      suits.push.apply(suits, suits) // 8 items
      suits.push.apply(suits, suits) // 16 items
      random = Math.floor(Math.random() * suits.length) // 0 - 15
      suits.push(suits[random]) // 17 items

      lx.randomizeArray(suits)
      lx.randomizeArray(numbers)

      var total = suits.length
      var ii
        , jj
        , added
        , card
        , added
        , suit
        , number
      
      for (ii = 0; ii < total; ii += 1) {
        card = suits[ii] + numbers[ii]
        added = lx.addItemToArray(card, random17)

        if (!added) {
          duplicate += 1
        }
      }

      if (duplicate) {
        // Hack to fill up with first available cards
        for (ii = 0; ii < numbers.length; ii += 1) {
          for (jj = 0; jj < suits.length; jj += 1) {
            card = suits[jj] + numbers[ii]

            added = lx.addItemToArray(card, random17)

            if (added) {
              duplicate -= 1
              if (!duplicate) {
                ii = 9999
                jj = 9999
              }
            }
          }       
        }
      }

      return random17
    }
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