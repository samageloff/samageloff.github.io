console.log('\'Allo \'Allo!'); // eslint-disable-line no-console

  var body = document.querySelector('body');

  function doSomeBasicAnimations() {
    var triangleHole = document.querySelector('.triangle-hole');

    var fade = setTimeout(function() {
      body.classList.add('ready');
    }, 500);

    var triangle = setTimeout(function() {
      triangleHole.classList.add('in');
    }, 2500);
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  }


  /*
    Usage:
      data-pivotr='{"threshold": "low", "action": "addClass", "direction": "any"}'

      options:
        // how fast you have to scroll to trigger stuff
        threshold: low (> 20 < 100), med (> 120 < 200), high (> 200) (default: low)

        // method you want to trigger on the element
        action: addClass, removeClass, toggleClass (default: addClass)

        // which scroll/direction will trigger the event
        direction: any, left, right, up, down (default: any)
   */
  function Pivotr(opt_config) {

    this.elems = [];
    this.map = new Map();
    this.emit = this.pubsub_();

    if (opt_config) {
      this.config = opt_config;
    }

    console.log('Pivotr loaded');
    this.init_();
  }

  Pivotr.prototype.view = window;

  Pivotr.prototype.init_ = function() {
    this.mapElems_();
    this.listen_();
  };

  Pivotr.prototype.mapElems_ = function() {
    var attrs = document.querySelectorAll('[data-pivotr]');
    var elems = Array.prototype.slice.call(attrs);

    elems.forEach(function(elem, index, array) {

      if (!elem.getAttribute('id')) {
        var id = this.createUniqueId();
        elem.setAttribute('id', id);
      }

      // Then, get the attribute data
      var attrs_ = JSON.parse(elem.dataset.pivotr);
      this.map.set(elem.id, attrs_);

      this.emit.subscribe(attrs_.threshold, this.decorateElem_.bind(this));
    }, this);
  };

  Pivotr.prototype.listen_ = function() {
    this.view.addEventListener('wheel', function(e) {
      this.handleEvents_(e);
    }.bind(this), false);
  };

  Pivotr.prototype.handleEvents_ = function(e) {
    // +Y up, -Y down, -X right, +X left

    var vert = (e.deltaY >= 1 && e.deltaY !== -1 || e.deltaY === 0 ) ? 'up' : 'down';
    var horz = (e.deltaX <= 0) ? 'right' : 'left';

    console.log(e.deltaY, e.deltaX);

    this.direction = vert + ' ' + horz;
    this.emit.publish(this.direction, 'direction');
    this.updateDeltas_();
  };

  Pivotr.prototype.decorateElem_ = function(topics, data) {
    console.log('decorate elem', topics, data);
  };

  Pivotr.prototype.updateDeltas_ = debounce(function() {
    // Reset direction
    console.log('reset');
  }, 250);

  Pivotr.prototype.createUniqueId = function() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  Pivotr.prototype.pubsub_ = function() {
    var topics = {};
    var hop = topics.hasOwnProperty;

    return {
      subscribe: function(topic, listener) {
        // Create the topic's object if not yet created
        if(!hop.call(topics, topic)) topics[topic] = [];

        // Add the listener to queue
        var index = topics[topic].push(listener) -1;

        // Provide handle back for removal of topic
        return {
          remove: function() {
            delete topics[topic][index];
          }
        };
      },
      publish: function(topic, info) {
        console.log(topic);
        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if(!hop.call(topics, topic)) return;

        // Cycle through topics queue, fire!
        topics[topic].forEach(function(item) {
      		item(info !== undefined ? info : {});
        });
      }
    };
  };

  doSomeBasicAnimations();

var site = new Pivotr();
