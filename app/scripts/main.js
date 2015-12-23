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

  function debug() {
    var el = document.createElement('div');
    el.setAttribute('class', 'debugger');
    body.appendChild(el);
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

  function Pivotr(elem, config) {
    this.elem = elem;
    this.config = config;
    this.currentPos = 0;
    this.vert = e.deltaY;

    console.log('Pivotr enabled.');
  }

  Pivotr.prototype.init = function() {

    window.addEventListener('mousewheel', mousewheel, false);

    var debugConsole = document.querySelector('.debugger');

    debugConsole.innerHTML = [
      'vert: ', vert, 'currentPos: ', currentPos
    ];

    if (vert > currentPos || vert < currentPos) {
      currentPos = currentPos + vert;
      console.log(currentPos, vert);
    }

    if (currentPos === 2500) {
      debugConsole.innerHTML = 'YAY';
    }

    if (currentPos > -2500 && currentPos < -2000) {
      debugConsole.innerHTML = 'BOO';
    }

    updateDeltas();
    e.preventDefault();

    doSomeBasicAnimations();
    debug();

    var updateDeltas = debounce(function() {
      console.log('saving position', currentPos);
    }, 250);

};
