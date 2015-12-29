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
        threshold: low, med, high (default: low)

        // method you want to trigger on the element
        action: addClass, removeClass, toggleClass (default: addClass)

        // which scroll/direction will trigger the event
        direction: any, left, right, up, down (default: any)
   */
  function Pivotr(opt_config) {

    this.arrays = [];

    this.triggers = [
      {"vert_plus_1000": {'elem':'<div class="content-block shadow-depth-3" data-pivotr="[{"addClass":"show", "direction": "vert", "timer" : 1000}, {"removeClass": "show", "direction": "vert", "timer":-1000}]"><img src="https://scontent-ord1-1.xx.fbcdn.net/hphotos-xlp1/t31.0-8/10269131_10151993536642187_4397032661863746536_o.jpg" width="200"></div>', addClass: "show"}},
      {"vert_minus_1000": {'elem': '<img src="images/triangle-hole.png" alt="" class="triangle-hole" data-pivotr="{&quot;addClass&quot;: &quot;show&quot;, &quot;direction&quot;: &quot;vert&quot;, &quot;timer&quot;: 2000}">', removeClass: "show"}}
    ];

    this.map = new Map();

    // For PubSub
    this.topics = {};
    this.subUid = -1;

    // Store accumulative X and Y values
    this.currentPositionX = 0;
    this.currentPositionY = 0;

    if (opt_config) {
      this.config = opt_config;
    }

    console.log('Pivotr loaded');
    this.init_();
  }

  Pivotr.prototype.view = window;

  Pivotr.prototype.init_ = function() {
    this.mapTriggers_();
    this.listen_();
  };

  Pivotr.prototype.mapTriggers_ = function() {
    var data = document.querySelectorAll('[data-pivotr]');
    var elems = Array.prototype.slice.call(data);

    elems.forEach(function(elem, index, array) {
      var pivotrs_ = JSON.parse(elem.dataset.pivotr);
      var pivotr;
      var len = pivotrs_.length;
      var i = 0;

      // if there are multiple pivotrs on a node
      // we need to create a reference to each of them,
      // and to their parent node
      if (len) {
        for (i; i < len; i++) {
          pivotr = createPivotrObj_(pivotrs_[i], elem);
        }
      } else {
        pivotr = createPivotrObj_(pivotrs_, elem);
      }

      this.arrays.push(pivotr);
    }, this);

    function createPivotrObj_(obj, elem) {
      var temp = {};
      var objKey = obj.direction + "_" + obj.timer;
      temp[objKey] = obj;
      var pivotrObj = temp;
      return pivotrObj;
    }

    // this.processMap_();
  };

  Pivotr.prototype.processMap_ = function() {
    var temp = [];
    this.triggers = temp.concat.apply([], this.arrays);
    console.log(this.triggers);
  };

  Pivotr.prototype.listen_ = function() {
    this.view.addEventListener('wheel', function(e) {
      this.handleEvents_(e);
    }.bind(this), false);
  };

  Pivotr.prototype.handleEvents_ = function(e) {
    var vert = 'vert_' + (e.deltaY < 0) + '_' + Math.abs(e.deltaY);
    var horz = e.deltaX;

    if (this.triggers) {
      console.log(vert);
    }

    if (e.deltaY > this.currentPositionY || e.deltaY < this.currentPositionY) {
      this.currentPositionY = this.currentPositionY + e.deltaY;
      console.log(this.currentPositionY, e.deltaY);
    }

    if (e.deltaX > this.currentPositionX || e.deltaX < this.currentPositionX) {
      this.currentPositionX = this.currentPositionX + e.deltaX;
      console.log(this.currentPositionX, e.deltaX);
    }

    this.updateDeltas_();
  };

  Pivotr.prototype.updateDeltas_ = debounce(function() {
    console.log('saving position X', this.currentPositionX,
        'saving position Y', this.currentPositionY);
  }, 500);

  Pivotr.prototype.subscribe = function(topic, func) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    var token = (++this.subUid).toString();
    this.topics[topic].push({
      token: token,
      func: func
    });
    return token;
  };

  Pivotr.prototype.publish = function(topic, args) {
    if (!this.topics[topic]) {
      return false;
    }
    setTimeout(function() {
      var subscribers = this.topics[topic],
          len = subscribers ? subscribers.length : 0;

      while (len--) {
        subscribers[len].func(topic, args);
      }
    }, 0);
    return true;
  };

  Pivotr.prototype.unsubscribe = function(token) {
    for (var m in this.topics) {
      if (this.topics[m]) {
        for (var i = 0, j = this.topics[m].length; i < j; i++) {
          if (this.topics[m][i].token === token) {
            this.topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return false;
  };

  doSomeBasicAnimations();

var site = new Pivotr();
