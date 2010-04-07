var Notification = (function() {
  var that = {};
  var default_options = {
    theme: 'default',
    duration: 5000,
    onStart: function() { return true ;},
    onEnd: function() { return true ;}
  };
  that.themes = {
    'default': {
      position: 'fixed',
      'top': '-1px',
      border: '1px solid #000',
      padding: '5px',
      margin: '0 auto',
      height: '12px',
      paddingTop: '5px',
      background: '#FFEFC6',
      fontSize: '15px',
      textAlign: 'center'
    },
  }

  // Accessor for the options attributes. You can alter default options through
  // here and set new defaults to use in the future.
  that.options = default_options;

  that.send = function(options) {
    var required_options = [ 'message' ], notification;
    validateOptions(options, required_options);
    options = objectMerge(default_options, options);

    if (this.notification !== undefined) {
      this.clear(options);
    }
    this.notification = buildMessageContainer(options);
    if (options.onStart(notification)) {
      document.body.appendChild(this.notification);
      this.notification.style.left = (document.body.offsetWidth - this.notification.offsetWidth) / 2 + "px"
    };
    if (options.duration > 0) {
      this.timeout = setTimeout(function () {
        that.clear();
        options.onEnd(this.notification);
      }, options.duration);
    }
  };

  that.clear = function() {
    if (this.notification !== undefined) {
      document.body.removeChild(this.notification);
      this.notification = undefined;
      if (this.timeout !== undefined) {
        clearTimeout(this.timeout);
      };
    };
  };

  /////////////////////
  // Private Methods //
  /////////////////////

  var buildMessageContainer = function(options) {
    if (typeof options.message !== 'string') { raise("ArgumentError", "message should be a string") };
    var message_container = document.createElement('div');
    var text_container = document.createElement('span');
    var message_body = document.createTextNode(options.message);
    message_container.appendChild(text_container);
    text_container.appendChild(message_body);

    for (style_index in that.themes[options.theme]) {
      message_container.style[style_index] = that.themes[options.theme][style_index];
    }
    return message_container;
  };

  // Raises an error object with a passed name and message
  var raise = function(name, message) {
    if (that.log_level && that.log_level === 'debug') {
      console.error(name, message);
    }
    throw {
      name: name,
      message: message
    }
  };

  // Validates +passed_options+ object, so that it must contain all the
  // attributes defined in the +required_options+ hash
  var validateOptions = function(passed_options, required_options) {
    var index, missing_option;
    if (typeof passed_options !== 'object') { raise("ArgumentError", "options must be an object") };
    for (index = 0 ; index < required_options.length ; index ++) {
      missing_option = required_options[index];
      if (!passed_options.hasOwnProperty(missing_option) || passed_options[missing_option] === undefined) {
        raise("ArgumentError", "options object must include a " + missing_option + " attribute");
      }
    }
    return true;
  };

  // Merges two objects. The second object overwrites the first object
  var objectMerge = function(receiver, options) {
    var resulting_options = cloneObj(receiver);
    for (option_index in options) {
      resulting_options[option_index] = options[option_index];
    }
    return resulting_options;
  };

  function cloneObj(o) {
    if(typeof(o) != 'object') return o;
    if(o == null) return o;
    var newO = new Object();
    for(var i in o) newO[i] = cloneObj(o[i]);
    return newO;
  }

  return that;
})();
