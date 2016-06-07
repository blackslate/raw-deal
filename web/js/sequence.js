;(function createSequencePuzzle(lx){

  lx.addConstructor(Sequence)
 
  function Sequence(options) {
    this.cues = [
      { sequence: ["S1", "H1", "D1", "C1"]
      , stories: [
         "A stranger in a suit and hat fed my dodo to the cat"
        ]
      }
    , { sequence: ["S1", "S2", "S3", "S4"]
      , stories: [
          "A suit as bright as the sun attacked a sumo in a sari"
        ]
      }
    ]
    this.repeatAfter = 1
    this.allottedTime = 5000
    this.scoreMethod = "updateScore"
    this.setOptions(options)

    this.startTime = 0
    this.attempts = [1,1,1,1,1, 1,1,1,1,1]
    this.attemptCount = 20
    this.total = this.cues.length
  }

  Sequence.prototype.setOptions = function setOptions(options) {
    var option 

    if (typeof options !== "object") {
      return
    }

    option = options.cues
    if (Array.isArray(option)) {
      // TO DO: check for only arrays containing strings of type "S1" ... "C13"
      this.cues = option
    }

    option = options.extras
    if (Array.isArray(option)) {
      // TO DO: check for only strings of type "S1" ... "C13"
      this.extras = option
    }

    option = parseInt(options.repeatAfter, 10)
    if (isNaN(option)) {
      option = this.repeatAfter
    }
    option > -1 ? option < this.cues.length
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

    option = options.scoreMethod
    if (typeof option === "string"
        && typeof this[option] === "function") {
      this.scoreMethod = option
    }
  }

  Sequence.prototype.updateScore = function updateScore(result, showProgress) {
    var correct
      , worst
    var attempts = this.attempts
    var elapsed = + new Date() - this.startTime
    var elapsed = Math.max(this.allottedTime, elapsed)
    result = result * this.allottedTime / elapsed

    attempts.push(result)

    if (attempts.length > this.attemptCount) {
      // Find lowest score out of 10 earliest scores <HARD-CODED>
      worst = Math.min.apply(null, attempts.slice(0, 10))
      worst = attempts.indexOf(worst)
      attempts.splice(worst, 1)
    }

    correct = attempts.reduce(function (previous, current) {
      return previous + current
    }, 0)

    correct = Math.min(100, (correct / this.attemptCount) * 100)
    showProgress(correct)

    return correct
  }

  Sequence.prototype.initialize = function initialize() {
    var that = this
    var cardback = document.querySelector("img.back")
    var cardface = document.querySelector("img.face")
    var progress = document.querySelector(".progress")
    var answers = document.querySelector(".answers")
    var answerDivs = [].slice.call(answers.querySelectorAll("div"))
    var path = "img/images/"
    var remaining = 2
    var distractors = []
    var imageLUT = {}
    var scoreToUnlock = 80
    var imageMap
      , imageNames
      , data
      , sequence
      , stories
      , story

    $.getJSON(path + "names.json",  function (data) {
      imageMap = data
      start()
    })

    preloadImages(
      path
    , [ "C1.jpg", "C2.png", "C3.jpg", "C4.jpg", "C5.jpg", "C6.jpg"
      , "C7.jpg", "C8.jpg", "C9.jpg", "C10.jpg", "C11.jpg", "C12.jpg"
      , "C13.jpg", "D1.png", "D2.jpg", "D3.jpg", "D4.jpg", "D5.jpg"
      , "D6.jpg", "D7.jpg", "D8.jpg", "D9.jpg", "D10.jpg", "D11.jpg"
      , "D12.jpg", "D13.jpg", "H1.png", "H2.jpg", "H3.jpg", "H4.jpg"
      , "H5.jpg", "H6.jpg", "H7.jpg", "H8.jpg", "H9.jpg", "H10.jpg"
      , "H11.jpg", "H12.png", "H13.jpg", "S1.jpg", "S2.jpg", "S3.png"
      , "S4.jpg", "S5.jpg", "S6.jpg", "S7.jpg", "S8.jpg", "S9.jpg"
      , "S10.png", "S11.jpg", "S12.jpg", "S13.jpg"
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
        newSequence()
      }
    }
  
    function newSequence(){
      data = lx.randomItemFromArray(that.cues, that.repeatAfter)
      sequence = data.sequence
      stories = data.stories

      cardface = lx.createCard({card: sequence[0]})
      showSequence()

      answers.onmouseup = answers.ontouchend = answer
      that.startTime = + new Date()

      function showSequence() {
        var total = sequence.length
        var ii
          , div
          , key

        for (ii = 0; ii < total; ii += 1) {
          div = answerDivs[ii]
          key = sequence[ii]
          div.querySelector("img.image").src = imageLUT[key].src
          div.querySelector("p").innerHTML = imageMap[key]
        }        
      }
    }

    function answer(event){
      var target = event.target.tagName.toUpperCase() === "DIV"
                 ? event.target
                 : event.target.parentNode
      var index = answerDivs.indexOf(target)
     
    }

    function showProgress(correct) {
      //correct = correct * seenImages.length / that.total
      correct = 50
      progress.style.width = correct + "%"

      if (correct === 100) {
        levelComplete()
      } else if (scoreToUnlock && correct > scoreToUnlock) {
        unlockNextLevel()
      }
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