class WelcomeController < ApplicationController
require 'forecast_io'

  def index

  	#Get Current Location on Page Load
  	myLocation = cookies[:lat_lng].to_s.split('|')
  	latitude = myLocation[0]
  	longitude = myLocation[1]

  	#Forecast.io API info
  	ForecastIO.api_key = '489e6541e3f4c8d407a3152e17f8e8d3'
	forecast   = ForecastIO.forecast(latitude, longitude) 
  	@timezone  = forecast.timezone

 	#Current Weather Data
 	currentForecast 				= forecast.currently # gives you the current forecast datapoint
 	@currentApparentTemp			= currentForecast.apparentTemperature.round.to_s + "°"
 	@currentCloudCover				= currentForecast.cloudCover
 	@currentDewPoint				= currentForecast.dewPoint
 	@currentHumidity				= currentForecast.humidity
 	@currentNearestStormBearing		= currentForecast.nearestStormBearing
 	@currentNearestStormDistance	= currentForecast.nearestStormDistance
 	@currentOzone					= currentForecast.ozone
 	@currentPrecipIntensity			= currentForecast.precipIntensity
 	@currentPrecipProbability		= currentForecast.precipProbability
 	@currentPressure				= currentForecast.pressure
	@currentSummary  				= currentForecast.summary.downcase 
	@currentTemp 	 				= currentForecast.temperature.round.to_s + "°"
  	@currentTime 					= currentForecast.time
  	@currentVisibility				= currentForecast.visibility
  	@currentWindBearing				= currentForecast.windBearing
  	@currentWindSpeed 				= currentForecast.windSpeed

  	#Reformat forecast.io icon strings to be readable by skycons (upcase and underscores instead of dash)
 	currentIcon					= currentForecast.icon.upcase
	if currentIcon 	  == "PARTLY-CLOUDY-DAY"
		@currentSkycon = "PARTLY_CLOUDY_DAY"		
	elsif currentIcon == "PARTLY-CLOUDY-NIGHT"
		@currentSkycon = "PARTLY_CLOUDY_NIGHT"
	elsif currentIcon == "CLEAR-DAY"
		@currentSkycon = "CLEAR_DAY"
	elsif currentIcon == "CLEAR-NIGHT"
		@currentSkycon = "CLEAR_NIGHT"
	elsif currentIcon == "CLOUDY"
		@currentSkycon = currentIcon
	elsif currentIcon == "RAIN"
		@currentSkycon = currentIcon
	elsif currentIcon == "SLEET"
		@currentSkycon = currentIcon
	elsif currentIcon == "SNOW"
		@currentSkycon = currentSkycon
	elsif currentIcon == "WIND"
		@currentSkycon = currentSkycon
	elsif currentIcon == "FOG"
		@currentSkycon = currentSkycon			 			 			 			 			 			
	end


	#Daily Weather Data
	@dailyForecastJSON 	= forecast.daily
	dailyForecast 	 	= forecast.daily




  end

end
