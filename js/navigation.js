 var showSection

 ;(function navigation(){
  var sections = getSections()


  showSection = function showSection(sectionName) {
    var section = sections[sectionName]
    var active = "active" // </HARD-CODED>

    if (!section) {
      console.log("showSection – unknown section: " + sectionName)
      return
    } else if (section.classList.contains(active)) {
      return // already active
    }

    document.body.removeAttribute("style")
    
    for (name in sections) {
      section = sections[name]

      if (name === sectionName) {
        section.classList.add(active)
      } else {
        section.classList.remove(active)
      }      
    }

    if (sectionName === "licence") {
      document.body.classList.add("licence")
    } else {
      document.body.classList.remove("licence")
    }
  }

  function getSections() {
    var sections = {}
    var temp = document.querySelectorAll("section")
    var total = temp.length
    var ii
      , section
    
    for (ii = 0; ii < total; ii += 1) {
      section = temp[ii]
      sections[section.id] = section
    }

    return sections
  }
})()