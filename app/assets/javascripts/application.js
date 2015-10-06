// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require local_time
//= require_tree .



function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function getGeoLocation() {
  navigator.geolocation.getCurrentPosition(setGeoCookie);
}

function setGeoCookie(position) {
	//set lat_lng cookie
  var cookie_val = position.coords.latitude + "|" + position.coords.longitude;
  document.cookie = "lat_lng=" + cookie_val + ';Path=/;';
  	//split lat/lng 
  var latlngStr = getCookie("lat_lng").split('|', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  var jsonURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng["lat"] + "," + latlng["lng"] + "&key=AIzaSyB0OIPv-lxJMdFF2-0mNj-Fz4YMuFENrqI";
  	//read JSON data
  $.ajax({ 
              type: 'GET', 
              url: jsonURL, 
              data: { get_param: 'value' }, 
              dataType:'json',
              success: function (data) { 
              	//get city and state
                     
                     var formattedAddress = data["results"][0]["formatted_address"];
                  //set location arrow icon, city / state as button text, enable button
                     document.getElementById("spinnerIcon").className = "fa fa-location-arrow";      
                     document.getElementById("btnText").innerHTML = "&nbsp; " +  formattedAddress;
  				           document.getElementById("locationBtn").disabled = false;

              }
          });

}

function deleteCookie() {
	document.cookie = 'lat_lng=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function initMap() {

  var map;
  var geoJSON;
  var request;
  var gettingData = false;
  var openWeatherMapKey = "bde284412fd6573dbf7bd492894c6d3f"

  function initialize() {
    var mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(41,-87),
      disableDefaultUI: true,
      scrollwheel: false
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    // Add interaction listeners to make weather requests
    google.maps.event.addListener(map, 'idle', checkIfDataRequested);

    // Sets up and populates the info window with details
    map.data.addListener('click', function(event) {
      infowindow.setContent(
       "<img src=" + event.feature.getProperty("icon") + ">"
       + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
       + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
       + "<br />" + event.feature.getProperty("weather")
       );
      infowindow.setOptions({
          position:{
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          },
          pixelOffset: {
            width: 0,
            height: -15
          }
        });
      infowindow.open(map);
    });
  }

  var checkIfDataRequested = function() {
    // Stop extra requests being sent
    while (gettingData === true) {
      request.abort();
      gettingData = false;
    }
    getCoords();
  };

  // Get the coordinates from the Map bounds
  var getCoords = function() {
    var bounds = map.getBounds();
    var NE = bounds.getNorthEast();
    var SW = bounds.getSouthWest();
    getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
  };

  // Make the weather request
  var getWeather = function(northLat, eastLng, southLat, westLng) {
    gettingData = true;
    var requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
                        + westLng + "," + northLat + "," //left top
                        + eastLng + "," + southLat + "," //right bottom
                        + map.getZoom()
                        + "&cluster=yes&format=json"
                        + "&APPID=" + openWeatherMapKey;
    request = new XMLHttpRequest();
    request.onload = proccessResults;
    request.open("get", requestString, true);
    request.send();
  };

  // Take the JSON results and proccess them
  var proccessResults = function() {
    console.log(this);
    var results = JSON.parse(this.responseText);
    if (results.list.length > 0) {
        resetData();
        for (var i = 0; i < results.list.length; i++) {
          geoJSON.features.push(jsonToGeoJson(results.list[i]));
        }
        drawIcons(geoJSON);
    }
  };

  var infowindow = new google.maps.InfoWindow();

  // For each result that comes back, convert the data to geoJSON
  var jsonToGeoJson = function (weatherItem) {
    var feature = {
      type: "Feature",
      properties: {
        city: weatherItem.name,
        weather: weatherItem.weather[0].main,
        temperature: weatherItem.main.temp,
        min: weatherItem.main.temp_min,
        max: weatherItem.main.temp_max,
        humidity: weatherItem.main.humidity,
        pressure: weatherItem.main.pressure,
        windSpeed: weatherItem.wind.speed,
        windDegrees: weatherItem.wind.deg,
        windGust: weatherItem.wind.gust,
        icon: "http://openweathermap.org/img/w/"
              + weatherItem.weather[0].icon  + ".png",
        coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
      },
      geometry: {
        type: "Point",
        coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
      }
    };
    // Set the custom marker icon
    map.data.setStyle(function(feature) {
      return {
        icon: {
          url: feature.getProperty('icon'),
          anchor: new google.maps.Point(25, 25)
        }
      };
    });

    // returns object
    return feature;
  };

  // Add the markers to the map
  var drawIcons = function (weather) {
     map.data.addGeoJson(geoJSON);
     // Set the flag to finished
     gettingData = false;
  };


  // Clear data layer and geoJSON
  var resetData = function () {
    geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    map.data.forEach(function(feature) {
      map.data.remove(feature);
    });
  };

  google.maps.event.addDomListener(window, 'load', initialize);

}


function newMap() {

      var attribution = new ol.Attribution({
      html: 'Tiles &copy; <a href="http://maps.nls.uk/townplans/glasgow_1.html">' +
          'National Library of Scotland</a>'
    });

    var map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
            attributions: [
              new ol.Attribution({
                html: 'Tiles &copy; <a href="http://www.opencyclemap.org/">' +
                    'OpenCycleMap</a>'
              }),
              ol.source.OSM.ATTRIBUTION
            ],
            url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
          })
        }),
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            attributions: [attribution],
            url: 'http://geo.nls.uk/maps/towns/glasgow1857/{z}/{x}/{-y}.png'
          })
        })
      ],
      view: new ol.View({
        center: [-472202, 7530279],
        zoom: 12

      })
    });


}




