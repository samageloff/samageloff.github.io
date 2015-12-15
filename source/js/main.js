(function() {
  'use strict';

  var container = document.querySelector('.content');
  var items = Array.from(document.querySelectorAll('.item'));

  for (var item of items) {
    console.log(item);
  }

  container.addEventListener('click', function(event) {
    var target = event.target;
    if (target.classList.contains('item')) {
      target.classList.toggle('active');
    }
  });

})();