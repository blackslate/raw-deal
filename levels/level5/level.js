;(function levelLoaded(level, lx){

  function Level() {
    this.name = "Random 17"
  }

  Level.prototype.initialize = function initialize() {
    var STORAGE_NAME = "random17"
    var cues
    var initialCount
    var options
    var game

    try {
      cues = JSON.parse(localStorage[STORAGE_NAME])
    } catch(error) {}

    if (!cues) {
      cues = getRandom17()
      localStorage[STORAGE_NAME] = JSON.stringify(cues)
    }

    initialCount = 8
    options = {
      cues: cues.slice(0, initialCount)
    , extras: cues.slice(initialCount)
    , allottedTime: 3500
    , scoreMethod: "addCardWhenReady"
    }
    game = lx.getInstance("CardMatch", options)
    game.initialize()

    function getRandom17() {
      var random17 = []
      var numbers = [5,6,7, 8,9,10, 11,12,13] // 9 items
      var suits = ["S", "H", "D", "C"]
      var duplicate = 0
      var random

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

  Level.prototype.kill = function kill() {
    // Clean up when level is about to be replaced
  }

  if (typeof lx.level.hash === "string") {
    if (typeof lx.level.map === "object") {
      var object = lx.level.map[lx.level.hash] = new Level()
    }
  }
})(window.level, lexogram) // <HARD-CODED global object>