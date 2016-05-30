var showChoice

;(function start(){
  var images = [].slice.call(document.querySelectorAll("#start img"))
  var div = document.querySelector("#start div")
  var button = document.getElementById("continue")
  var image = new Image()
  var white = new Image()
  white.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQAQMAAAC6caSPAAAAA3NCSVQICAjb4U/gAAAABlBMVEX///////9VfPVsAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8xNC8xNQkEnNcAAAAqSURBVHic7cExAQAAAMKg9U/tbwagAAAAAAAAAAAAAAAAAAAAAAAAAIA3T7AAATkWl3gAAAAASUVORK5CYII="

  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d');
  var back
    , face

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
      "<p>If you'd stayed, perhaps we could have gained something from each other, but it's your decision.</p>"
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

  button.onclick = function viewSummary() {
    showSection("summary")
  }

  image.onload = function(){
    console.log("image loaded")
    var width = image.width * 2
    var height = image.height * 2
    var radius = 30
    var right = width - radius
    var bottom = height - radius

    canvas.width = width
    canvas.height = height

    context.beginPath()
    context.arc(radius, radius, radius, Math.PI, 1.5*Math.PI, false)
    context.lineTo(right, 0)
    context.arc(right, radius, radius, 1.5*Math.PI, 0, false)
    context.lineTo(width, bottom)
    context.arc(right, bottom, radius, 0, 0.5*Math.PI, false)
    context.lineTo(radius, height)
    context.arc(radius, bottom, radius, 0.5*Math.PI, Math.PI, false)
    context.clip();
    context.drawImage(image, 0, 0, width, height);

    back = canvas.toDataURL()
   
    context.drawImage(white, 0, 0, width, height);
    face = canvas.toDataURL()
  }

  showChoice = function showChoice(chosen) {
    div.innerHTML = messages[chosen]
    var keys = Object.keys(messages)
    dealCards(keys.indexOf(chosen))
  }

  image.src = "img/card.png";

  function dealCards(selected) {
    var total = images.length
    var ii
      , image
    
    for (ii = 0; ii < total; ii += 1) {
      image = images[ii]
      if (ii === selected) {
        image.src = face
        image.classList.add("chosen")
      } else {
        image.src = back
      }
    }
  }
})()