/*
REQUIRES SVG images named J1, J2, Q1, Q2, K1, K2, and bg.gif
Dimensions of face card SVGs are approximate.
Image sizes and glyph positions are hard coded.
*/

var createCard

;(function () {
  var path = "img/"
  var type = ".svg"
  var faceImages = {
    J1: 0
  , J2: 0
  , Q1: 0
  , Q2: 0
  , K1: 0
  , K2: 0
  , bg: "bg.gif"
  }
  var faceNames = Object.keys(faceImages)
  var notLoaded
  var suits = {
    spades: "♠"
  , hearts: "♥"
  , diamonds: "♦"
  , clubs: "♣"
  }
  var cardColours = {
    black: "#000"
  , red: "#800"
  , white: "#fff"
  }
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d');
  var dimensions = { 
    width: 350
  , height: 600
  }

  ;(function preloadFacecards(){
    var total = faceNames.length
    var regex = new RegExp("\/(\\w+)(\\.gif|\\" + ".svg)")
    var timeout = setTimeout(downloadTimeout, 5000)
    var ii
      , image
      , name

    notLoaded = total
    
    for (ii = 0; ii < total; ii += 1) {
      image = new Image()
      image.onload = checkDownload
      image.onerror = downloadError
      // generate "name.svg" if no name is given
      name = faceImages[faceNames[ii]] || (faceNames[ii] + type)
      image.src = path + name
    }

    function checkDownload(event) {
      if (!timeout) {
        console.log("Late arrival", this.src)
        return
      }

      name = regex.exec(this.src)[1]
      faceImages[name] = this

      notLoaded -= 1
      if (!notLoaded) {
        clearTimeout(timeout)
        timeout = false

        canvas.width = dimensions.width
        canvas.height = dimensions.height

        if (typeof allImagesLoaded == 'function') { 
          allImagesLoaded(); 
        }
      }
    }

    function downloadError(event) {
      console.log("Error", this.src)
    }

    function downloadTimeout() {
      alert ("Download timeout")
      timeout = false
    }
  })()

  createCard = function createCard(map) {
    // Validate input
    typeof map !== "object" ? map = {} : null

    suit = map.suit
    number = map.number
    image = map.image

    if (Object.keys(suits).indexOf(suit) < 0 && suit !== "blank") {
      suit = "back"
    } else if (isNumber(number)) {
      number = parseInt(number)
      number = Math.max(1, Math.min(number, 13))
    } else {
      number = 1
    }

    if (!(image instanceof HTMLImageElement)) {
      image = new Image()
      map.image = image
    }

    if (notLoaded && number > 10) {
      alert("Facecards may not be available yet")
    }
    
    // Set dimensions
    var width = dimensions.width
    var height = dimensions.height
    var radius = width / 10
    var right = width - radius
    var bottom = height - radius
    var colour

    switch (suit) {
      case "back":
        createBack()
        break

      case "blank":
        createBlank()
        break

      default:       
        createFront()
    }

    function createShape(){
      context.beginPath()
      context.arc(radius, radius, radius, Math.PI, 1.5*Math.PI, false)
      context.lineTo(right, 0)
      context.arc(right, radius, radius, 1.5*Math.PI, 0, false)
      context.lineTo(width, bottom)
      context.arc(right, bottom, radius, 0, 0.5*Math.PI, false)
      context.lineTo(radius, height)
      context.arc(radius, bottom, radius, 0.5*Math.PI, Math.PI, false)
    }

    function createBack() {
      createShape()
      context.clip()
      context.drawImage(faceImages.bg, 0, 0, width, height)

      createShape()
      context.closePath()
      context.lineWidth = radius / 2
      context.strokeStyle = cardColours.black
      context.stroke()
    }

    function createBlank() {
      createShape()    
      context.closePath()
      context.fillStyle = cardColours.white
      context.fill()
    }
      
    function createFront() {
      createBlank()

      colour = 1 + (["spades", "clubs"].indexOf(suit) || 1) // 0 | 2
      colour = [cardColours.red, 0, cardColours.black][colour]
      suit = suits[suit]

      switch (number) {
        case 1:
          number = "A"
          createAce()
        break

        case 11:
        case 12:
        case 13:
          number = "JQK".charAt(number - 11)
          createFace()
        break

        default:
          number = "" + number
          createPips()
      }
    }

    function createCorners() {
      context.fillStyle = colour
      context.textAlign = "center"
      context.font = "48px serif"
      context.fillText(suit, 40, 120)
      context.font = "64px serif"
      context.fillText(number, 40, 72)

      context.save();
      context.translate(350, 600)
      context.rotate(-Math.PI)    
      context.fillText(number, 40, 72)
      context.font = "48px serif"
      context.fillText(suit, 40, 120)
      context.restore()
    }

    function createAce() {
      createCorners()
      var baseline = 387
      var centre = 175

      context.font = "256px serif"
      context.fillText(suit, centre, baseline)

      /* 
      // Check for symmetry
      context.save();
      context.translate(350, 600)
      context.rotate(-Math.PI)    
      context.fillText(suit, centre - 20, baseline)
      context.restore()
      */
    }

    function createPips() {
      createCorners()

      var columns = [110, 175, 240]
      var rows = [148, 343, 245, 278, 214]
      // top, mid, top-half, thirds, top-third

      context.font = "128px serif"
      var rowCount = rows.length
      var colCount = columns.length
      var col
        , row
        , more
        , plus

      number = parseInt(number, 10)
      if (number < 4) {
        col = [columns[1]]
        row = [rows[0]]
        more = number % 2 ? [columns[1], rows[1]] : false
        plus = false
      } else if (number < 9) {
        col = [columns[0], columns[2]]
        row = [rows[0]]
        more = number % 2 || number === 8
             ? [columns[1], number>5 ? rows[2]: rows[1]]
             : false
        plus = number > 5 ? [[columns[0], columns[2]], [[rows[1]]]]
                          : false        
      } else {
        col = [columns[0], columns[2]]
        row = [rows[0]]
        more = [columns[1], rows[4]]
        plus = number > 5 ? [[columns[0], columns[2]], [[rows[3]]]]
                          : false
      }

      drawPips()
      flip(col, row)

      if (plus) {
        col = plus[0]
        row = plus[1]
        drawPips()
        if (number > 8) {
          flip(col, row)
        }
      }

      if (more) {
        context.fillText(suit, more[0], more[1])

        if (number === 10 || number === 8) {
          col = [more[0]]
          row = [more[1]]
          flip()
        }
      }

      function drawPips() {
        var ii   
        for (ii = 0; ii < row.length; ii += 1) {
          for (jj = 0; jj < col.length; jj += 1) {
            context.fillText(suit, col[jj], row[ii])
          }
        }
      }

      function flip() {
        context.save();
        context.translate(350, 600)
        context.rotate(Math.PI)    
        drawPips()
        context.restore()
      }
    }

    function createFace() {
      var version = 1
      var left = 70
      var top = 100
      var width = dimensions.width - (left * 2)
      var height = dimensions.height - (top * 2)
      var image

      createCorners()
      switch (suit) {
        case "♠":
        case "♥":
          version = 2
      }
      
      image = faceImages[number + version]
      context.fillStyle = colour
      context.fillRect(left, top, width, height)
      context.drawImage(image, left, top, width, height)
    }
    
    image.src = canvas.toDataURL()

    return image
  }

  // UTILITIES //
  function isNumber(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
  }
})()