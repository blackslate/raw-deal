;(function createCardMatchPuzzle(lx){

  lx.addConstructor(CardMatch)
 
  function CardMatch(options) {
    // this.suits = []
    // this.numbers = []
    this.cues = ["S1", "D11", "H12", "C13"]
    this.repeatAfter = 2
    this.allottedTime = 5000
    this.setOptions(options)
  }

  CardMatch.prototype.setOptions = function setOptions(options) {
    var option = options.cues
    if (Array.isArray(option)) {
      // TO DO: check for only strings of type "S1" ... "C13"
      this.cues = option
    }

    option = parseInt(options.repeatAfter, 10)
    if (isNaN(option)) {
      option = this.repeatAfter
    }

    option > 0 ? option < this.cues.length
                 ? this.repeatAfter = option
                 : this.repeatAfter = Math.floor(this.cues.length / 2)
               : null

    option = parseInt(options.allottedTime, 10)
    if (isNaN(option)) {
      option = this.allottedTime
    }

    if (option > 500) {
      this.allottedTime = option
    }
  }

  CardMatch.prototype.initialize = function initialize() {
    var self = this
    var cardback = document.querySelector("img.back")
    var cardface = document.querySelector("img.face")
    var overlay = document.querySelector("img.overlay")
    var progress = document.querySelector(".progress")
    var answers = document.querySelector(".answers")
    var answerDivs = [].slice.call(answers.querySelectorAll("div"))
    var path = "img/images/"
    var remaining = 2
    var distractors = []
    var imageLUT = {}
    var attempts = [1,1,1,1,1, 1,1,1,1,1]
    var unseenImages = []
    var attemptCount = 20
    var scoreToUnlock = 80
    var imageMap
      , imageNames
      , card
      , startTime

    $.getJSON(path + "names.json",  function (data) {
      imageMap = data
      start()
    })

    preloadImages(
      path
    , [ "C1.jpg" // <HARD-CODED>
      , "C2.png"
      , "C3.jpg"
      , "C4.jpg"
      , "C5.jpg"
      , "D1.png"
      , "D2.jpg"
      , "D3.jpg"
      , "D4.jpg"
      , "D5.jpg"
      , "H1.png"
      , "H2.jpg"
      , "H3.jpg"
      , "H4.jpg"
      , "H5.jpg"
      , "S1.jpg"
      , "S2.jpg"
      , "S3.png"
      , "S4.jpg"
      , "S5.jpg"
      ]
    , start
    )

    function preloadImages(path, names, callback) {
      var nameCount = names.length
      var regex = /\/((\w+)(\.png|\.jpg))$/ // add more extensions?
      var ii
        , image
      
      for (ii = 0; ii < nameCount; ii += 1) {
        image = new Image()
        image.onload = imageLoaded
        image.src = path + names[ii] 
      }

      function imageLoaded(event) {
        var result = regex.exec(this.src)
 
        if (result) {
          names.splice(names.indexOf(result[1]), 1) // XX.xxx
          imageLUT[result[2]] = this // XX

          if (!(nameCount -= 1)) {
            cardback.src = lx.createCard().src
            callback()
          }
        }
      }
    }

    function start(event) {
      if (!(--remaining)) {
        cardback.src = lx.createCard().src
        imageNames = Object.keys(imageLUT)
        newCard()
      }
    }
  
    function newCard(){
      overlay.classList.remove("fadeIn")
  
      card = lx.randomItemFromArray(self.cues, self.repeatAfter)
      cardface.src = lx.createCard({card: card}).src
      lx.addItemToArray(card, unseenImages)
      chooseDistractors()

      answers.onmouseup = answers.ontouchend = answer
      startTime = + new Date()

      function chooseDistractors() {
        var total = answerDivs.length
        var ii
          , div
          , key

        distractors.length = 0
        
        for (ii = 0; ii < total; ii += 1) {
          distractors.push(lx.randomItemFromArray(imageNames, total))
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
        overlay.src = target.querySelector("img").src
        updateScore(1)
        fadeInAnswer()

      } else if (!target.classList.contains("disabled")) {
        target.classList.add("disabled")       
        updateScore(0)
      }
    }


    function updateScore(result) {
      var correct
        , worst
      var elapsed = Math.max(self.allottedTime, + new Date() - startTime)
      result = result * self.allottedTime / elapsed

      attempts.push(result)

      if (attempts.length > attemptCount) {
        // Find lowest score out of 10 earliest scores <HARD-CODED>
        worst = Math.min.apply(null, attempts.slice(0, 10))
        worst = attempts.indexOf(worst)
        attempts.splice(worst, 1)
      }

      correct = attempts.reduce(function (previous, current) {
        return previous + current
      }, 0)

      correct = Math.min(100, (correct / attemptCount) * 100)
      progress.style.width = correct + "%"

      console.log(correct, unseenImages.length)

      if (unseenImages.length === self.cues.length) {
        if (correct === 100) {
          levelComplete()
        } else if (scoreToUnlock && correct > scoreToUnlock) {
          unlockNextLevel()
        }
      }
    }

    function fadeInAnswer() {
      answers.onmouseup = answers.ontouchend = null
      overlay.classList.add("fadeIn")
      setTimeout(newCard, 1500)
    }

    function levelComplete() {
      lx.puzzle.completed(lx.puzzle.hash)
    }
    
    function unlockNextLevel() {
      scoreToUnlock = 0
      lx.puzzle.unlock()
    }
  }
})(lexogram) // <HARD-CODED global object>