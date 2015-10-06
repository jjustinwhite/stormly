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

