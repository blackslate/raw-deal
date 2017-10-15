;(function levelManager(window, document, lx){
  var STORAGE_NAME = "goMap"
  var STATUS = { 
    locked: "locked"
  , active: "active"
  , unlocked: "unlocked"
  , started: "started"
  , completed: "completed"
  , archived: "archived" // may be synonym for completed
  }

  var level = lx.level = {
    map: {}
  , hash: ""
  , completed: levelCompleted
  , unlock: unlockNextLevel
  }

  var levelObject

  var level_css = document.querySelector(".level_css")
  var level_js = document.querySelector(".level_js")
  var $main = $("body>main")
  var isIPhone =navigator.userAgent.toLowerCase().indexOf("iphone")>-1
  var isIE = (navigator.userAgent.indexOf('MSIE') > -1
           || navigator.appVersion.indexOf('Trident/') > -1)
  // Does this also also detect Android?
  var links = [].slice.call(document.querySelectorAll("nav a"))
  var locked = []
  var levels = []
  var dragStart
  var link
  var playedMap


  ;(function treatEvents(){
    document.querySelector("nav").addEventListener(
      "mouseup"
    , showGame
    , false)
    document.querySelector("nav").addEventListener(
      "touchstart"
    , prepareForDrag
    , false)
    document.querySelector("nav").addEventListener(
      "touchend"
    , checkForDrag
    , false)

    // Prevent the user from moving and resizing by mistake on a mobile
    $main.on("touchstart", function(event) {
      event.preventDefault
        ? event.preventDefault()
        : (event.returnValue = false)
    })
  })()

  ;(function initializeMap(){
    try {
      playedMap = JSON.parse(localStorage[STORAGE_NAME])
    } catch(error) {}

    if (!playedMap) {
      playedMap = {}
    }
  })()

  ;(function disableByPlatform(){
    var disabled = []
    var link

    if (isIPhone) {
      disabled.push("#notOnIPhone") // customize
    } else if (isIE) {
      disabled.push("#notOnIE") // customize
    }

    for (var ii in disabled) {
      link = document.querySelector("li a[href='"+ disabled[ii]+"']")
      if (link) {
        link.style.display = "none"
      }
    }
  })()

  // Check which levels the user has already solved
  ;(function showPlayedGames(){
    if (!window.localStorage) {
      return
    }

    // { button: 0, dials: 1 } // active = 0, done = 1
    var hash
      , status

    links.forEach(function checkStatus(link) {
      hash = getHashFrom(link)
      levels.push(hash)
      status = playedMap[hash] || STATUS.locked
      link.className = status

      if (status === STATUS.locked) {
        locked.push(hash)
      }
    })
  })()

  // Public methods
  function unlockNextLevel() {
    var hash = locked.shift()
    if (hash) {
      updatePlayedStatus(hash, STATUS.unlocked)
    }
  }

  function levelCompleted(hash) {
    updatePlayedStatus(hash, STATUS.completed)

    var index = levels.indexOf(hash) + 1
    if (index === levels.length) {
      alert("Game complete")
    } else {
      openGame(levels[index])
    }
  }

  // Event methods
  function prepareForDrag(event) {
    dragStart = getClientLoc(event)  
  }

  function checkForDrag(event) {
    var dragEnd = getClientLoc(event)
    var dragX = dragEnd.x - dragStart.x
    var dragY = dragEnd.y - dragStart.y
    var drag2 = (dragX * dragX) + (dragY * dragY)

    if (drag2 < 9) {
      showGame(event)
    }
  }

  // Load the chosen game
  function showGame(event, override) {
    link = getLink(event, override)
    // becomes <a> element or undefined
    if (!link) {
      // The click was on a nav sub-element above the <a> element, or 
      // on a locked link
      return
    }

    /**
     * Extracts "levelName" from the link the user clicked, e.g.
     *   "http://example.com/folder/index.html#levelName"
     * @return {string or false}
     */
    var hash = getHashFrom(link)

    updatePlayedStatus(hash, STATUS.active, link)
 
    // CLEAN UP EXISTING PUZZLE IF THERE IS ONE
    if (levelObject && levelObject.kill) {
      levelObject.kill()
    }
    $main.empty() // ensure no CSS conflict between levels

    // PREPARE PATHs FOR NEW PUZZLE
    var path = "levels/" + hash + "/level."
    
    // CHECK IF THIS PUZZLE HAS ALREADY BEEN LOADED
    levelObject = level.map[hash]
    if (levelObject) {
      // Set the CSS and HTML for this level from cache
      level_css.setAttribute("href", path + "css")
      $main.load( path + "html", reloadLevel )
    } else {
      loadLevel()
    }

    function loadLevel() {
      level.hash = hash

      // GET AJAX AND CALL prepareLevel() ON SUCCESS
      var remaining = 3

      $main.load( path+"html", loaded)
      level_css = swapFile(level_css, "link", "href", path + "css")
      level_js = swapFile(level_js, "script", "src", path + "js")

      function loaded (mainElement) {
        checkIfAllIsLoaded()
      }

      function elementLoaded(event) {
        var element = event.target
        element.removeEventListener("load", elementLoaded, false)
        checkIfAllIsLoaded()
      }

      function checkIfAllIsLoaded() {
        if (!--remaining) {
          // HTML and CSS are ready, and the IIFE in the JS file will
          // have 
          levelObject = level.map[hash]
          if (levelObject && levelObject.initialize) {
            levelObject.initialize()
          } else {
            console.log("Unable to initialize level " + hash)
          }
        }
      }

      function swapFile(current, type, attribute, path) {
        var element = document.createElement(type)
        current.parentNode.replaceChild(element, current)
        element.addEventListener("load", elementLoaded, false)
        if (type === "link") {
          element.setAttribute("rel", "stylesheet")
          element.setAttribute("type", "text/css")
        }
        element.setAttribute(attribute, path)

        return element
      }
    }

    function reloadLevel() {
      levelObject.initialize()
    }
  }

  function getLink(event, override) {
    var element = event.target
    var notLink = true

    // Find <a> element in hierarchy
    while (element // not undefined
        && element.tagName // not body
        && (notLink = element.tagName.toLowerCase() !== "a") 
      ) {
      element = element.parentNode // may now be <a>
    }

    if (element === document 
      || (!override && element.classList.contains(STATUS.locked))) {
      event.preventDefault()
      element = undefined
    }

    return element // <a> or undefined
  }

  function updatePlayedStatus(hash, newStatus, link) {
    var currentStatus = playedMap[hash]
    var link = link || getLinkFrom(hash)
    var index

    if (currentStatus !== newStatus) {
      playedMap[hash] = newStatus
    }

    if (newStatus === STATUS.active) {
      disactivateOthers()
    }

    localStorage[STORAGE_NAME] = JSON.stringify(playedMap)
    link.className = newStatus

    if (newStatus !== STATUS.locked) {
      index = locked.indexOf(hash)
      if (index > -1) {
        locked.splice(index, 1)
      }
    }

    return newStatus

    function disactivateOthers() {
      var levels = Object.keys(playedMap)

      levels.forEach(disactivate)

      function disactivate(level) {
        var status
          , link

        if (level === hash) {
          // Leave this level active
        } else {
          if (playedMap[level] = STATUS.active) {
            // Update localStorage data
            playedMap[level] = STATUS.unlocked
            // Update interface
            link = getLinkFrom(level)
            link.classList.remove(STATUS.active)
          }
        }
      }
    }
  }

  function getHashFrom(link) {
    index = link.href.indexOf("#") + 1
    hash = link.href.substring(index) 

    return hash
  }

  function getLinkFrom(hash) {
    var link

    links.every(function showMatchingGame(testLink) {
      if (hash === getHashFrom(testLink)) {
        link = testLink
        return false
      }

      return true
    })

    return link
  }

  // Load the game defined by the window.location.hash, if it exists
  function openGame(hash) {
    var link

    while (hash.charAt(0) === "#") {
      hash = hash.substring(1)
    }

    link = getLinkFrom(hash)

    if (link) {
      showGame({ target: link }, true ) // even if it is locked
    }
  }

  openGame(window.location.hash || "level1")
})(window, document, lexogram)

/**
 * createSquareArea — workaround for the lack of vmin|vmax support
 *                    on iOS 7
 * @param  {object} window   creates minifiable copy of global
 * @param  {object} document creates minifiable copy of global
 */
;(function createSquareArea(window, document) {
  var main = document.querySelector("main")
  var nav = document.querySelector("nav")
  var navWidth = nav.getBoundingClientRect().width
  var debounceDelay = 100
  var timeout

  window.onresize = windowResized
  maintainRatio()

  function windowResized() {
    if (timeout) {
      window.clearTimeout(timeout)
    }
    timeout = window.setTimeout(maintainRatio, debounceDelay)
  }

  function maintainRatio() {
    timeout = 0
    var tweak = 0 // 6 // to avoid showing scrollbars unnecessarily

    var windowHeight = window.innerHeight
    var mainWidth = window.innerWidth - navWidth
    var minDimension = Math.min(windowHeight, mainWidth) - tweak

    var left = (mainWidth - minDimension) / 2 + navWidth
    var top = (windowHeight - minDimension) / 2

    main.style.left = left + "px"
    main.style.top = top + "px"
    main.style.width = minDimension + "px"
    main.style.height = minDimension + "px"

    broadcastEvent("windowResized") // so that levels can use it
  }

  function broadcastEvent(eventName) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent#Notes
    var event = document.createEvent('Event')
    event.initEvent(eventName, true, true) // bubbles, cancelable
    document.dispatchEvent(event)
  }
})(window, document)

/**
 * Utility method
 * @param  {mouse event|touch event} event [description]
 * @return {object}       { x: <...pageX>, y: <...pageY> }
 */
var clientLoc
function getClientLoc(event) {
  // var clientLoc should be declared at the lowest common level
  // where it is used. If event is a touchend event, the the last
  // known value of clientLoc will still be in memory.
  
  if (!clientLoc) {
    clientLoc = { x: 0, y: 0 }
  }

  if (isNaN(event.clientX)) {
    if (event.targetTouches) {
      touch = event.targetTouches[0]
      if (touch) {   
        clientLoc.x = touch.clientX
        clientLoc.y = touch.clientY
      }
    }
  } else {          
    clientLoc.x = event.clientX
    clientLoc.y = event.clientY
  }

  return clientLoc
} 
