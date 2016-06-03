var allImagesLoaded
var showChoice

;(function start(){
  var images = [].slice.call(document.querySelectorAll("#start img"))
  var div = document.querySelector("#start div")
  var button = document.getElementById("continue")
  var messages = {
    refuse: // I do not agree, without even scrolling 
      "<p>You don't even want to try.</p>" +
      "<p>That's fine, you failed the first test anyway. I don't think it would have worked out.</p>" +
      "<p>So long.</p>"
  , disagree: // I do not agree, after scrolling straight to the end
      "<p>You're not very adventurous, are you?</p>" +
      "<p>How much richer would your life be, if you simply took the time to pay attention? Perhaps you'll never know.</p>"
  , desist: // I do not agree, after activating the animation
      "<p>You give up easily, don't you? The first sign of something unusual and you're gone.</p>" +
      "<p>If you'd stayed, perhaps we could have gained something from each other, but it's your decision.</p>" +
      "<p>Take care.</p>"
  , renounce: // I do not agree, after the animation completes
      "<p>You tried. I don't have much hope for you, but at least you tried.</p>" +
      "<p>Choices aren't always black and white. With practice, perhaps you'll discover that there is always another alternative.</p>"
  , agree: // I agree, after scrolling straight to the end
      "<p>You agree. That's so nice of you.</p>" +
      "<p>It's disappointing, isn't it, to learn that you have failed the first test? Did you even notice that there was a test? You just gave a conditioned response, like one of Pavlov's dogs.</p>" +
      "<p>OK, I'll give you this one chance. Make the most of it.</p>"
  , jostle: // I agree, after activating the animation
      "<p>Woah! You can slow down.</p>" +
      "<p>Just. Slow. Down.</p>" +
      "<p>You can take your time to choose wisely. I hope we're not off to a bad start together.</p>"
  , consent: // I agree, after the animation completes
      "<p>Life is tricky, isn't it? You always have to make choices, and live by the consequences.</p>" +
      "<p>There was a better choice to make, but you didn't see it. Still, you are full of optimism. There is hope for you yet.</p>"
  , enter: // Enter or Return, after activating the animation
      "<p>Yes! I have high hopes for you.</p>" +
      "<p>You pay attention. You notice the details. You take your time to think and decide. Welcome to my world.</p>"
  , return: // Enter or Return, without activating the animation
      "<p>You took a shortcut. You've been here before, haven't you? Or was that just a lucky move?</p>"
  }
  var exit = false
  var back
    , blank

  button.onclick = function viewSummary() {
    if (exit) {
      location.reload()
    } else {
      showSection("summary")
    }
  }

  allImagesLoaded = function allImagesLoaded() {
    back = createCard()
    blank = createCard({suit: "blank"})
  }

  showChoice = function showChoice(chosen) {
    div.innerHTML = messages[chosen]
    var keys = Object.keys(messages)
    dealCards(keys.indexOf(chosen))

    switch (chosen) {
      case "refuse":
      case "disagree":
      case "desist":
        exit = true
    }
  }

  function dealCards(selected) {
    var total = images.length
    var ii
      , image
    
    for (ii = 0; ii < total; ii += 1) {
      image = images[ii]
      if (ii === selected) {
        image.src = blank.src
        image.classList.add("chosen")
      } else {
        image.src = back.src
      }
    }
  }
})()