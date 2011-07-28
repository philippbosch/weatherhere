(function() {
  $(function() {
    var positionError, positionOptions, prevCoords, updatePosition;
    ($("body")).bind("touchmove", function(e) {
      return e.preventDefault();
    });
    prevCoords = null;
    updatePosition = function(pos) {
      if (prevCoords && (prevCoords.latitude === pos.coords.latitude) && ((prevCoords.longitude = pos.coords.longitude) != null)) {
        return;
      }
      $.getJSON("http://jsonp.pb.io/http://where.yahooapis.com/geocode?location=" + pos.coords.latitude + "+" + pos.coords.longitude + "&gflags=R&flags=J&appid=g8tsa13c&callback=?", function(data) {
        var place, result, woeid;
        result = data.ResultSet.Results[0];
        place = result.line2;
        woeid = result.woeid;
        ($("#place")).text(place);
        return $.getJSON("http://query.yahooapis.com/v1/public/yql/philippbosch/weatherhere?woeid=" + woeid + "&unit=c&format=json&callback=?", function(data) {
          var weather;
          weather = data.query.results.rss.channel.item;
          ($("#today-condition")).text(weather.condition.temp + '°');
          ($("#today-high")).text(weather.forecast[0].high + '°');
          ($("#today-low")).text(weather.forecast[0].low + '°');
          ($("#tomorrow-high")).text(weather.forecast[1].high + '°');
          ($("#tomorrow-low")).text(weather.forecast[1].low + '°');
          ($("#tomorrow-weekday")).text(weather.forecast[1].day);
          ($("#today-condition")).css("background-image", "url(http://l.yimg.com/a/i/us/we/52/" + weather.condition.code + ".gif)");
          return ($("#tomorrow-condition")).css("background-image", "url(http://l.yimg.com/a/i/us/we/52/" + weather.forecast[1].code + ".gif)");
        });
      });
      return prevCoords = pos.coords;
    };
    positionError = function(err) {
      var mockPosition;
      ($("#status")).text(err.code + " " + err.message);
      mockPosition = {
        coords: {
          accuracy: 1,
          latitude: 52.4963017,
          longitude: 13.4324942,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: (new Date()).getTime()
      };
      return updatePosition(mockPosition);
    };
    positionOptions = {
      enableHighAccurary: true
    };
    return navigator.geolocation.watchPosition(updatePosition, positionError, positionOptions);
  });
}).call(this);
