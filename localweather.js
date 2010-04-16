function update(e) {
    $('#update').attr('disabled', true);
    $('#status').text('Detecting geoposition …');
    window.navigator.geolocation.getCurrentPosition(function(position) {
        updateWeather(position.coords);
    }, function(e) {
        var coordsFallback = {'latitude': 52.5317432, 'longitude': 13.4272981};
        updateWeather(coordsFallback);
        $('#status').text('Unable to detect geoposition.');
    });
}

$(document).ready(function() {
    $('body').bind('touchmove', function(e) {
        e.preventDefault();
    });
    update();
    $('#update').click(update);
});

var weatherConditionMapping = {
    '38': '37',
    '03': '00',
    '04': '00',
    '02': '01',
    '44': '30',
    '40': '12',
    '41': '16',
    '42': '16',
    '24': '23'
};

function updateWeather(coords) {
    $('#status').text('Looking up location …');
    $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.places%20where%20lat%3D%22' + coords.latitude + '%22%20and%20lon%3D%22' + coords.longitude + '%22&format=json&diagnostics=true&callback=?', function(data) {
        var place = data.query.results.places.place;
        var woeid = data.query.results.places.place.woeid;
        $('#place').text(place.name.replace(/,.*/,''));
        $('#status').text('Getting weather data …');
        $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D\'http%3A%2F%2Fweather.yahooapis.com%2Fforecastrss%3Fw%3D' + woeid + '%26u%3Dc\'&format=json&diagnostics=true&callback=?', function(data) {
            var condition = data.query.results.item.condition;
            var forecast = data.query.results.item.forecast;
            var condition_code = String(condition.code);
            if (condition_code.length == 1) {
                condition_code = '0' + condition_code;
            }
            var forecast_code = String(forecast[1].code);
            if (forecast_code.length == 1) {
                forecast_code = '0' + forecast_code;
            }
            if (weatherConditionMapping[condition_code]) condition_code = weatherConditionMapping[condition_code];
            $('#today .condition').text(condition.temp + '°').css('background-image', 'url("img/' + condition_code + '.png")');
            $('#high').text('H: ' + forecast[0].high + '°');
            $('#low').text('T: ' + forecast[0].low + '°');
            
            $('#tomorrow .condition').css('background-image', 'url("img/' + forecast_code + '.png")');
            $('#tomorrow-weekday').text(forecast[1].day);
            $('#tomorrow-high').text(forecast[1].high + '°');
            $('#tomorrow-low').text(forecast[1].low + '°');
            
            $('#status').text('');
            $('#update').attr('disabled', false);
        });
    });
}
