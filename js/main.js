(function() {

  // Wunderground API Globals
  var CONFIG = {

    api_key: '087808a74260f837',
    baseurl: 'http://api.wunderground.com/api/',
    city: 'Brooklyn',
    limit: 1,
    state: 'NY',
    type: 'forecast',

    DOM: {
      widget_list: '.weather span'
    },

    JSON: {
      callback: 'renderForecast'
    }

  };

  function widgetView() {
    // Inject JSON(P)
    res = document.createElement('script');
    res.type = 'text/javascript';
    res.src = CONFIG.baseurl+CONFIG.api_key+'/'+CONFIG.type+'/q/'+CONFIG.state+'/'+CONFIG.city+'.json?callback='+CONFIG.JSON.callback;
    document.head.appendChild(res);

    // Callback JSON(P)
    renderForecast = function(res) {
      // Error Messaging
      if (!res.forecast) {
        console.log('err');
        return;
      }
      else {
        // Configure DOM
        var response = res.forecast.simpleforecast.forecastday,
            widgetList = document.querySelector(CONFIG.DOM.widget_list),
            // Assign Response to 'data' Object
            data = {
              days: response.slice(0, CONFIG.limit)
            },
            ref = data.days[0];

        // Mustache Template
        output = Mustache.render("<em class='icon-{{icon}}'></em><span>{{high.fahrenheit}}&deg / {{low.fahrenheit}}&deg</span>", ref);
        widgetList.innerHTML = output;
      }
    };
  }

  function init() {
    widgetView();
  }

  init();

})();