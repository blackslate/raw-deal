;(function licence() {
  // <HARD-CODED>
  var checkTime = 500 // milliseconds
  var checkDelay = 40 // milliseconds => 25 fps
  var minDelta = 16 // scrollTop pixels
  var zalgoChars = { 
    up: " ̍ ̎ ̄ ̅ ̿ ̑ ̆ ̐ ͒ ͗ ͑ ̇ ̈ ̊ ͂ ̓ ́ ͊ ͋ ͌ ̃ ̂ ̌ ͐ ̀ ́ ̋ ̏ ̒ ̓ ̔ ̽ ̉ ͣ ͤ ͥ ͦ ͧ ͨ ͩ ͪ ͫ ͬ ͭ ͮ ͯ ̾ ͛"
  , mid: " ̕ ̛ ̀ ́ ͘ ̡ ̢ ̧ ̨ ̴ ̵ ̶ ͜ ͝ ͞ ͟ ͠ ͢ ̷ ͡҉"
  , down: " ̖ ̗ ̘ ̙ ̜ ̝ ̞ ̟ ̠ ̤ ̥ ̦ ̩ ̪ ̫ ̬ ̭ ̮ ̯ ̰ ̱ ̲ ̳ ̹ ̺ ̻ ̼ ͅ ͇ ͈ ͉ ͍ ͎ ͓ ͔ ͕ ͖ ͙ ͚ ̣"
  }
  // </HARD-CODED>

  var licenceSection = document.getElementById("licence")
  var licenceDiv = document.querySelector("#licence .text")
  var agreeButton = document.getElementById("agreeButton")
  var disagreeButton = document.getElementById("disagreeButton")

  var zalgoText = document.getElementsByClassName("zalgo")[0]
  var scrollArray = getFilledArray(checkTime/checkDelay, 0)
  var zalgoHeader = null
  var maskDiv = null
  var scrolledToEnd = false
  var animated = 0
  var maxScroll

  ;(function initialize(){
    zalgoText.parentNode.removeChild(zalgoText)
    zalgoChars.up = zalgoChars.up.split(" ")
    zalgoChars.mid = zalgoChars.mid.split(" ")
    zalgoChars.down = zalgoChars.down.split(" ")

    agreeButton.onclick = agree
    disagreeButton.onclick = disagree
    document.onkeypress = keypress
  })()

  ;(function checkForPausedScroll(){
    maxScroll = licenceDiv.scrollHeight - licenceDiv.clientHeight
    var tripScroll = maxScroll * 0.30
    var scrollTop = licenceDiv.scrollTop
    var min = Math.min.apply(null, scrollArray)
    var max = Math.max.apply(null, scrollArray)

    if (scrollTop > minDelta
     && scrollTop !== maxScroll
     && max === scrollTop
     && (min === scrollTop
     || (scrollTop > tripScroll && min > scrollTop - minDelta))) {
      enableAgreeButton()
      startZalgoAnimation()
      startMonitoringScroll(scrollTop/maxScroll)

    } else {
      scrollArray.shift()
      scrollArray.push(scrollTop)
      setTimeout(checkForPausedScroll, checkDelay)

      if (scrollTop === maxScroll) {
        scrolledToEnd = true
        enableAgreeButton()
      }
    }
 
    function enableAgreeButton() {
      agreeButton.removeAttribute("disabled")
    }
  })()

  function startZalgoAnimation() {
    animated = 1

    ;(function autoScrollToHeader(){
      var licenceRect = licenceDiv.getBoundingClientRect()
      var licenceTop = licenceRect.top
      var headers = [].slice.call(licenceDiv.querySelectorAll("h2"))
      var minDistance = Number.MAX_VALUE
      var distance = 0

      headers.every(
        function distanceIsSmaller(header) {
          var headerTop = header.getBoundingClientRect().top
          var absDistance = Math.abs(headerTop - licenceTop)

          if (minDistance > absDistance) {
            minDistance = absDistance
            distance = headerTop - licenceTop
            zalgoHeader = header
            return true

          } else {
            disableManualScroll()
            startScrollToHeader()
            return false
          }
        }
      )

      function startScrollToHeader() {
        var duration = Math.floor(Math.abs(distance) * 10)// <HARD-CODED>
        var startTime = + new Date()
        var scrollTop = licenceDiv.scrollTop

        ;(function autoScroll(){
          var elapsed = + new Date() - startTime

          if (elapsed < duration) {
            setTimeout(autoScroll, checkDelay)
          } else {
            elapsed = duration
            startHeaderTransition()
          }

          licenceDiv.scrollTop = scrollTop
                               + (elapsed / duration) * distance
        })()
      }

      function startHeaderTransition() {
        var spacingLUT = { // <HARD-CODED>
          "Licence": -0.520
        , "Restrictions": -.450
        , "Acknowledgments": -0.590
        , "Indemnification": -0.490
        , "Modifications to Site": -0.455
        , "Term and Termination": -0.510
        , "Severability": -0.465
        , "Amendments to this Agreement": -0.520
        , "Rationality": -0.455
        }
        var spacing = spacingLUT[zalgoHeader.innerHTML] || -0.450
        var duration = 500 // <HARD-CODED>
        var startTime = + new Date()
        
        ;(function squeezeHeader(){
          var elapsed = + new Date() - startTime
          if (elapsed > duration) {
            elapsed = duration
            stretchHeader()
          } else {
            setTimeout(squeezeHeader, checkDelay)
          }

          var letterSpacing = (spacing * elapsed / duration) + "em"
          zalgoHeader.style.letterSpacing = letterSpacing
        })()
        
        function stretchHeader() {
          var replacement = "Rationality"
          var endTime = + new Date() + duration
          spacing = spacingLUT[replacement]
          zalgoHeader.innerHTML = replacement
          zalgoHeader.style.letterSpacing = spacing
          

          ;(function unSqueezeHeader(){
            var remaining = endTime - new Date()
            if (remaining < 0) {
              remaining = 0
              addZalgoText()
            } else {
              setTimeout(unSqueezeHeader, checkDelay)
            }

            var letterSpacing = (spacing*remaining/duration) + "em"
            zalgoHeader.style.letterSpacing = letterSpacing
          })()
        }
      }
  
      function disableManualScroll() {
        maskDiv = document.createElement("div")
        maskDiv.style.width = licenceRect.width + "px"
        maskDiv.style.height = licenceRect.height + "px"
        maskDiv.style.left = licenceRect.left + "px"

        maskDiv.className = "mask"
        licenceSection.appendChild(maskDiv)
      }
    })()
  }

  function addZalgoText() {
    zalgoHeader.style.marginBottom = "0em"
    zalgoHeader.parentNode.insertBefore(zalgoText, zalgoHeader.nextSibling)
    var heights = []
    var paragraphs = [].slice.call(zalgoText.querySelectorAll("p"))
    var total = paragraphs.length
    var duration = 500 // <HARD-CODED>
    var targetHeight = 120
    var startTime  = + new Date()
    var ratio
      , red
      , paragraph
      , margin
      , ii

    ;(function getParagraphHeights(){
      for (ii = 0; ii < total; ii += 1) {
        heights.push(paragraphs[ii].getBoundingClientRect().height)
      }
    })()

    zalgoText.classList.add("compressed", "faded")

    ;(function fadeIn(){
      var elapsed = + new Date() - startTime
      var opacity
 
      if (elapsed < duration) {
        opacity = elapsed / duration
        opacity *= opacity
        zalgoText.style.opacity = opacity
        setTimeout(fadeIn)

      } else {
        zalgoText.classList.remove("faded")
        zalgoText.removeAttribute("style")
        duration = 4000 // <HARD-CODED>
        startTime  = + new Date()
        spreadZalgo()
      }
    })()

    function spreadZalgo(){
      var elapsed = + new Date() - startTime
 
      if (elapsed < duration) {
        transition()
      } else {
        removeElementStyles()
      }

      function transition() {
        ratio = elapsed / duration
        ratio *= ratio
        ratio *= ratio
        red = Math.floor(224 - 96 * ratio)
        margin = ratio + "em"
        zalgoHeader.style.marginBottom = margin
         
        for (ii = 0; ii < total; ii += 1) {
          paragraph = paragraphs[ii]
          paragraph.style.height = heights[ii] * ratio + "px"
          paragraph.style.lineHeight = targetHeight * ratio + "%"
          paragraph.style.marginTop = margin
          paragraph.style.color = "rgb("+ red +", 0, 0)"
        }

        setTimeout(spreadZalgo, checkDelay)
      }

      function removeElementStyles() {
        for (ii = 0; ii < total; ii += 1) {
          paragraphs[ii].removeAttribute("style")
        }
        zalgoHeader.removeAttribute("style")
        zalgoText.classList.remove("compressed")
        licenceSection.removeChild(maskDiv)

        animated = 2
      }
    }

    ;(function startPepperingText() {
      var paraCount = paragraphs.length
      var charTotal = 0
      var charTextArray = []
      var charCountArray = []
      var zalgoDelay = 1
      var rate = 1.003
      var charIndex
        , paraIndex
        , paraTotal
        , paraText
        , zalgoChar

      ;(function getParagraphCharCounts() {
        var ii
          , charCount
        
        for (ii = 0; ii < paraCount; ii += 1) {
          paraText = paragraphs[ii].textContent
          charTextArray.push(paraText)
          charCount = paraText.length
          charCountArray.push(charCount)
          charTotal += charCount
        }
      })()
      
      ;(function pepperText(){
        charIndex = Math.floor(Math.random() * charTotal)
        paraIndex = 0
        while (charIndex > (paraTotal = charCountArray[paraIndex])) {
          paraIndex += 1
          charIndex -= paraTotal
        }

        charCountArray[paraIndex] += 1
        charTotal += 1

        zalgoChar = getRandomZalgoChar()
        paraText = charTextArray[paraIndex]
        paraText = paraText.substring(0,charIndex)
                 + zalgoChar
                 + paraText.substring(charIndex)
        charTextArray[paraIndex] = paraText       
        paragraphs[paraIndex].innerHTML = paraText

        setTimeout(pepperText, zalgoDelay)
        zalgoDelay *= rate
      })()
      
      ;(function pepperLastText(){
        var lastPara = paraCount - 1
        charIndex = charCountArray[lastPara]
        charIndex = Math.floor(Math.random() * charIndex)

        charCountArray[lastPara] += 1
        charTotal += 1

        zalgoChar = getRandomZalgoChar()
        paraText = charTextArray[lastPara]
        paraText = paraText.substring(0,charIndex)
                 + zalgoChar
                 + paraText.substring(charIndex)
        charTextArray[lastPara] = paraText       
        paragraphs[lastPara].innerHTML = paraText

        setTimeout(pepperLastText, checkDelay)
       })()

      function getRandomZalgoChar() {
        var down = zalgoChars.down
        var random = Math.floor(Math.random() * down.length)
        
        return down[random]
      }
    })()
  }

  function startMonitoringScroll(scrollRatio) {
    /*
    TO DO: Handle ratios when user changes the width of the window, so licenceDiv.clientHeight changes but the scrollTop does not. 
     */
    var initialRatio = scrollRatio
    var furthestRatio = scrollRatio

    var rgb = window.getComputedStyle(document.body ,null)
                    .getPropertyValue('background-color')
    var rgb =  /(\d+),\s*(\d+),\s*(\d+)/.exec(rgb)
    // ["221, 221, 221", "221", "221", "221"]
    var red = parseInt(rgb[1], 10)
    var green = parseInt(rgb[2], 10)
    var blue = parseInt(rgb[3], 10)
    var initialRed = red
    var initialGreen = green
    var initialBlue = blue
    var topRed = 128
    var ratio
      , temp
      , furthestRed
    
    var ticking = false 

    function updateBackgroundColour() {
      maxScroll = licenceDiv.scrollHeight - licenceDiv.clientHeight
      scrollTop = licenceDiv.scrollTop
      scrollRatio = scrollTop / maxScroll

      var deltaRatio = initialRatio - scrollRatio // +ve = down

      if (furthestRatio < scrollRatio) {
        furthestRatio = scrollRatio

        ratio = (1 - scrollRatio) /  (1 - initialRatio)
        red = Math.floor(initialRed * ratio)
        green = Math.floor(initialGreen * ratio)
        blue = Math.floor(initialBlue * ratio)

        furthestRed = red
        
      } else if (red <= topRed) {
        ratio = scrollRatio / furthestRatio
        red = Math.floor(topRed - (topRed - furthestRed) * ratio)
      }

      rgb = "rgb("+red+","+green+","+blue+")"
      document.body.style.backgroundColor = rgb
    }

    licenceDiv.addEventListener('scroll', function(event) {

      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateBackgroundColour();
          ticking = false
        });
      }
      ticking = true
    })
  }

  // EVENTS //
  // 
  // "refuse"
  // "disagree"
  // "renounce"
  // "agree"
  // "consent" 
  // "enter" 
  // "return"
  
  function disagree(event) {
    showSection("start")

    if (animated === 2) {
      showChoice("renounce")
    } else if (animated) {
      showChoice("desist")
    } else if (scrolledToEnd) {
      showChoice("disagree")
    } else {
      showChoice("refuse")
    }
  }
  
  function agree(event) {
    showSection("start")

    if (animated === 2) {
      showChoice("consent")
    } else if (animated) {
      showChoice("jostle")
    } else {
      showChoice("agree")
    }
  }

  function keypress(event) {
    showSection("start")

    if (event.target !== document.body) {
      // Ignore keyboard navigation on buttons
     } else if (event.charCode !== 13) {
      // Ignore keys other than RETURN/ENTER
      
    } else if (animated === 2) {
      showChoice("enter")
    } else {
      showChoice("return")
    }
  }

  // UTILITY //
  function getFilledArray(count, value) {
    count = Math.floor(count) || 1

    return Array.apply(null, Array(count)).map(
      function(){
        return value
      }
    )
  }

})()