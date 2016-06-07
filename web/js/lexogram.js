/** LEXOGRAM **
* 160604
* 
* This script runs first, (before or after jQuery and jQuery UI have
* been initialized). It creates a global lexogram object to store all
* lexogram-specific functions and data.
*
* It also does a little housekeeping for Internet Explorer, in case
* there are any console methods in the code.
*
* As well as providing a centralized store of registered constructors
* and named instances, it is available for other objects to attach
* properties to the lexogram global "namespace".
*
* 160604: getInstance(constructorName, options) now accepts an
*         ancestor property in options, which can be used as the
*         prototype from which the new instance will inherit
*/



;(function lexogram(window){

  var lx = window.lexogram = {
  
    constructors: {}
 
  , instances: {}
  
  , options: {}
        
  , addConstructor: function addConstructor(constructor) {
     /* INPUT: <constructor> should be a function
      * ACTION: Adds a key/value entry to this.constructors, so that
      *         the constructor function can be identified by
      *         lexogram.constructors[<constructor name>]
      */
      
      var name = this.getConstructorName(constructor)
      if (name) {
        this.constructors[name] = constructor
      }
    }

  , getConstructorName: function getConstructorName(constructor) {
      var regex  = /^function\s*(\w+)/
      var result
      var name

      if (typeof constructor === "function") {
        result = regex.exec(constructor)
 
        if (result) {      // ["function Name", "Name"]
          name = result[1] //  "Name"
        }
      }

      return name // may be undefined
    }
   
  , getInstance: function getInstance(constructorName, options) {
     /* INPUT: <constructorName> should be the string name of a
      *         constructor function registered with addConstructor()
      *        <options> may be an object map. It may contain:
      *         - a name property, in which case a named instance of
      *           the constructor will be returned. Once it has been
      *           created, the same instance will always be returned
      *           in response to the same name
      *         - a singleton property, which may be a truthy value,
      *           in which case constructorName will be used as the
      *           name. Any subsequent requests for an instance of
      *           this constructor will always return the same
      *           singleton object, regardless of the name that is
      *           given, or whether singleton is specified.
      * NOTE:   If a named instance of a given constructor is
      *         requested first, and a singleton instance is requested
      *         later, the first (named) instance will continue to
      *         exist independently of the singleton.
      *           
      */
      
      (typeof options !== "object") ? options = {singleton: true} 
                                    : null       
      var name
      var instance 
      var constructor
      
      if (options.singleton) {
        name = constructorName
      } else {
        name = options.name
      }

      instance = this.instances[constructorName] // previous singleton
      
      if (!instance) {
        if (name) {
          instance = this.instances[name]
        }
      }
      
      if (!instance) {
        constructor = this.constructors[constructorName]

        if (typeof constructor === "function") {

          var ancestor = options.ancestor
          if (typeof ancestor === "string") {
            ancestor = this.constructors[ancestor]
            // may now be a function
          }

          if (typeof ancestor === "function") {
            constructor.prototype = Object.create(ancestor.prototype)
            constructor.constructor = constructor
          }

          instance = new constructor(options)
    
          if (name) {
            this.instances[name] = instance
          }
        } else {
          console.log("Constructor expected: " + constructorName)
        }
      }
          
      return instance // may be undefined
    }
    
  , callInstance: function callInstance(constructorName, methodName, options) {
      var instance = this.getInstance(constructorName)
      if (instance && instance[methodName]) {
        instance[methodName](options)
      }
    }
    
  , setOptions: function setOptions(options) {
      function OptionException() {
        this.message = message;
        this.name = "OptionException";
      }
      
      try {
        if (typeof options === "object") {
          $.extend(this.options, options)          
        } else {
          throw new OptionException("InvalidOptionsObject")
        }
      } catch(exception) {
        console.log(exception.name, exception.message)
      }
    }

  /** UTILITIES */
  , isNumber: function isNumber(number) {
      return !isNaN(parseFloat(number)) && isFinite(number);
    }

  , randomizeArray: function knuth (array) {
      var current = array.length
        , swap
        , random

      while (current) {
        random = Math.floor(Math.random() * current--);
        swap = array[current];
        array[current] = array[random];
        array[random] = swap;
      }
    }

  , randomItemFromArray: function randomItemFromArray(
      array, dontRepeat) {
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

  , removeRandomItemFromArray: function removeRandomItemFrom(array) {
      var index = Math.floor(Math.random()*(array.length))
      item = array.splice(index, 1)[0]
      return item
    }

  , addItemToArray: function addItemToArray(item, array){
      if (array.indexOf(item) < 0) {
        array.push(item)
        return true
      }

      return false
    }
  }
  
  
  /** HOUSEKEEPING
   * Protect window.console method calls, e.g. console is not defined
   * on Internet Explorer unless development tools are open, and
   * Internet Explorer doesn't define console.debug
   */
  var console = window.console

  if (!console) {
    // Create a placeholder console object
    console = window.console = {};
  }
  
  // The union of Chrome, FF, IE, and Safari console methods
  var methods = [
    "assert", "clear", "count", "debug", "dir", "dirxml", "error",
    "group", "groupCollapsed", "groupEnd", "info", "log",
    "markTimeline", "profile", "profileEnd", "time", "timeEnd",
    "timeStamp", "trace", "warn"
  ]
  var method
    , ii

  // Define each undefined method as a noop function to prevent errors
  for (ii = 0; ii < methods.length; ii++) {
    method = methods[ii]
    if (!console[method]) {
      console[method] = function() {};
    }    
  }
})(window)