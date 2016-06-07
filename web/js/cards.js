/*
REQUIRES SVG images named J1, J2, Q1, Q2, K1, K2, and bg.gif
Dimensions of face card SVGs are approximate.
Image sizes and glyph positions are hard coded.
*/

;(function cardCreator(lx) {
  var path = "img/"
  var faceSource = {
    black: "black.png"
  , red: "red.png"
  , bg: "bg.gif"
  }
  var faceImages = {
    "S13": { image: "black", rect: [[0,2], [0,3], 2, 3] }
  , "S12": { image: "black", rect: [[0,2], [1,3], 2, 3] }
  , "S11": { image: "black", rect: [[0,2], [2,3], 2, 3] }
  , "C13": { image: "black", rect: [[1,2], [0,3], 2, 3] }
  , "C12": { image: "black", rect: [[1,2], [1,3], 2, 3] }
  , "C11": { image: "black", rect: [[1,2], [2,3], 2, 3] }
  , "H13": { image: "red",   rect: [[0,2], [0,3], 2, 3] }
  , "H12": { image: "red",   rect: [[0,2], [1,3], 2, 3] }
  , "H11": { image: "red",   rect: [[0,2], [2,3], 2, 3] }
  , "D13": { image: "red",   rect: [[1,2], [0,3], 2, 3] }
  , "D12": { image: "red",   rect: [[1,2], [1,3], 2, 3] }
  , "D11": { image: "red",   rect: [[1,2], [2,3], 2, 3] }
  , "bg":  { image: "bg",    rect: [[0,1], [0,1], 1, 1] }
  }
  var notLoaded
  var suits = {
    spades: "♠"
  , hearts: "♥"
  , diamonds: "♦"
  , clubs: "♣"
  }
  var suitLUT = {
    "S": "spades"
  , "H": "hearts"
  , "D": "diamonds"
  , "C": "clubs"
  }
  var cardColours = {
    black: "#000"
  , red: "#800000"
  , white: "#fff"
  , border: "#200"
  }
  var dimensions = { 
    width: 350
  , height: 600
  }
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d');

  ;(function preloadFacecards(){
    var regex = new RegExp("\\/(\\w+)(\\.png|\\.gif)")
    var timeout = setTimeout(downloadTimeout, 5000)
    var key
      , image

    notLoaded = Object.keys(faceSource).length
    
    for (key in faceSource) {
      image = new Image()
      image.onload = checkDownload
      image.onerror = downloadError
      image.src = path + faceSource[key]
    }

    function checkDownload(event) {
      if (!timeout) {
        console.log("Late arrival", this.src)
        return
      }

      name = regex.exec(this.src)[1]
      faceSource[name] = this

      notLoaded -= 1
      if (!notLoaded) {
        clearTimeout(timeout)
        timeout = false
        createCroppedImages()
        
        canvas.width = dimensions.width     
        canvas.height = dimensions.height

        // if (typeof allImagesLoaded == 'function') { 
        //   allImagesLoaded(); 
        // }
      }
    }

    function createCroppedImages() {
      var key
        , data
        , source
        , rect
        , image
        , left
        , top
        , width
        , height
        , canvas
        , context

      for (key in faceImages) {
        data = faceImages[key]
        // { image: "black", rect: [[0,2], [0,3], 2, 3] }
        // { image: "red",   rect: [[1,2], [2,3], 2, 3] }
        source = faceSource[data.image]

        rect = data.rect
        width = source.width
        height = source.height
        left = width * rect[0][0] / rect[0][1]
        width /= rect[2]
        top = height * rect[1][0] / rect[1][1]
        height /= rect[3]

        canvas = document.createElement('canvas')
        context = canvas.getContext('2d');

        canvas.width = width
        canvas.height = height
        context.drawImage(
          source
        , left, top, width, height
        , 0,    0,   width, height
        )
        image = new Image()
        image.src = canvas.toDataURL()
        faceImages[key] = image
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

  /**
   * [createCard description]
   * @param  {object} map {suit: <"spades"|"hearts"|"diamonds"|"clubs"
   *                      ,number: <1 - 13>
   *                      ,image: HTMLImageElement
   *                      ,card: <"S1" ... "C13" | "blank">
   *                      }
   *                   If no map is given, image will be a card back
   *                   Use either suit and number, or card.
   * @return {HTMLImageObject} 
   */
  lx.createCard = function createCard(map) {
    // Validate input
    typeof map !== "object" ? map = {} : null

    var card = map.card || ""
    var suit = map.suit || suitLUT[card.charAt(0).toUpperCase()]
    var number = map.number || parseInt(card.substring(1), 10)
    var image = map.image

    if (suit) {
      card = suit.charAt(0).toUpperCase() + number
    }

    if (Object.keys(suits).indexOf(suit) < 0) {
      suit = (card === "blank") ? suit : "back"
    } else if (lx.isNumber(number)) {
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
      context.strokeStyle = cardColours.border
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
      
      console.log(card)

      image = faceImages[card]
      context.fillStyle = colour
      context.fillRect(left, top, width, height)
      context.drawImage(image, left+2, top+2, width-4, height-4)
    }
    
    image.src = canvas.toDataURL()

    return image
  }
})(lexogram)