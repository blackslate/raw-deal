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
    this.name = "Aces and Hearts"
  }

  Puzzle.prototype.initialize = function initialize() {
    console.log("Puzzle '" + this.name + "' initialized")

    var cardback = document.querySelector("img.back")
    var cardface = document.querySelector("img.face")
    var answers  = document.querySelector(".answers")
    var answerDivs = [].slice.call(answers.querySelectorAll("div"))
    var suits = ["spades", /*"hearts",*/ "diamonds", "clubs"]
    var numbers = [2, 3, 4, 5]
    var path = "img/images/"
    var remaining = 2
    var distractors = []
    var imageLUT = {}
    var imageMap
      , imageNames
      , card
      , error

    $.getJSON(path + "names.json",  function (data) {
      imageMap = data
      start()
    })

    function start(event) {
      if (!(--remaining)) {
        imageNames = Object.keys(imageLUT)
        newCard()
        answers.onmouseup = answers.ontouchend = answer
      }
    }

    preloadImages(
      path
    , [ "H1","H2","H3","H4","H5"
      , "S1","S2","S3","S4","S5"
      , "C1","C2","C3","C4","C5"
      , "D1","D2","D3","D4","D5"]
    , [".png", ".jpg"]
    , start
    )

    function preloadImages(path, names, types, callback) {
      var nameCount = names.length
      var typeCount = types.length
       var regex = getFileNameRegex(types)
      var ii
        , jj
        , image
      
      for (ii = 0; ii < nameCount; ii += 1) {
        for (jj = 0; jj < typeCount; jj += 1) {
          image = new Image()
          image.onload = imageLoaded
          image.src = path + names[ii] + types[jj]
        }     
      }

      function getFileNameRegex(types) {
        var regexString = "\\/(\\w+)("
        var total = types.length
        var ii
        
        for (ii = 0; ii < total; ii += 1) {
          regexString += "\\" + types[ii] + "|"
        }
        regexString = regexString.slice(0, -1) + ")"
        return new RegExp(regexString)
      }

      function imageLoaded(event) {
        var name = regex.exec(this.src)[1]
        names.splice(names.indexOf(name), 1)
        imageLUT[name] = this

        if (!(nameCount -= 1)) {
          cardback.src = createCard().src
          //console.log(imageLUT)
          callback()
        }
      }
    }
  
    function newCard(){
      var aces   = Math.random() < 0.5
      var suit   = aces
                 ? randomItemFromArray(suits, 1)
                 : "hearts"
      var number = aces
                 ? 1
                 : randomItemFromArray(numbers, 1)
      card = suit.charAt(0).toUpperCase() + number
      error = 0
 
      chooseDistractors()

      cardface.src = createCard({suit: suit, number: number}).src

      function chooseDistractors() {
        var total = 4
        var ii
          , div
          , key

        distractors.length = 0
        
        for (ii = 0; ii < total; ii += 1) {
          distractors.push(randomItemFromArray(imageNames, total))
        }

        if (distractors.indexOf(card) < 0) {
          distractors[(Math.floor(Math.random() * total))] = card
        }

        for (ii = 0; ii < total; ii += 1) {
          div = answerDivs[ii]
          key = distractors[ii]
          div.classList.remove("disabled")
          div.querySelector("img").src = imageLUT[key].src
          div.querySelector("p").innerHTML = imageMap[key]
        }        
      }
    }

    function answer(event){
      var target = event.target.tagName.toUpperCase() === "DIV"
                 ? event.target
                 : event.target.parentNode
      var index = answerDivs.indexOf(target)
      
      if (distractors[index] === card) {
        newCard()
      } else {
        if (!target.classList.contains("disabled")) {
          target.classList.add("disabled")
          error += 1
        }
      }
    }
    
    
    puzzle.completed(puzzle.hash)

    // UTILITIES //
    function randomItemFromArray(array, dontRepeat) {
      dontRepeat ? null : dontRepeat = 0
      var index = Math.floor(Math.random()*(array.length-dontRepeat))
      var item

      if (dontRepeat) {
        item = array.splice(index, 1)[0]
        array.push(item)
      } else {
        item = array[index]
      }

      return item
    }
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