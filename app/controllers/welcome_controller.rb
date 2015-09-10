class WelcomeController < ApplicationController
require 'forecast_io'

  def index
	if cookies[:lat_lng]
		@locationCookie = cookies[:lat_lng].to_s.split('|')
	end
  end

  def convert_time(time)
  	time = Time.at(time).to_date.strftime("%A")
  end

	def setgeo

		if cookies[:lat_lng]
			 lat_lng = cookies[:lat_lng]

  	myLocation = lat_lng.to_s.split('|')

  	ForecastIO.api_key = '489e6541e3f4c8d407a3152e17f8e8d3'  	

		@latitude   = myLocation[0]
	  	@longitude  = myLocation[1]
		forecast   = ForecastIO.forecast(@latitude, @longitude) 
	  	@timezone  = forecast.timezone

	 

	#Current Weather Data
	 	currentForecast 				= forecast.currently # gives you the current forecast datapoint

	 	@currentApparentTemp			= currentForecast.apparentTemperature.round.to_s + "°"
	 	@currentCloudCover				= (currentForecast.cloudCover * 100).to_i
	 	@currentDewPoint				= currentForecast.dewPoint.to_i
	 	@currentHumidity				= (currentForecast.humidity * 100).to_i
	 	@currentNearestStormBearing		= currentForecast.nearestStormBearing
	 	@currentNearestStormDistance	= currentForecast.nearestStormDistance.to_i
	 	@currentOzone					= currentForecast.ozone
	 	@currentPrecipIntensity			= currentForecast.precipIntensity.round(2)
	 	@currentPrecipProbability		= (currentForecast.precipProbability * 100).to_i
	 	@currentPressure				= currentForecast.pressure.to_i
		@currentSummary  				= currentForecast.summary.downcase 
		@currentTemp 	 				= currentForecast.temperature.round.to_s + "°"
	  	@currentTime 					= currentForecast.time
	  	@currentVisibility				= currentForecast.visibility
	  	@currentWindBearing				= currentForecast.windBearing
	  	@currentWindSpeed 				= currentForecast.windSpeed.to_i
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


#Daily/Today Weather Data

	@dailyForecastJSON 	= forecast.daily
	dailyForecast 	 	= forecast.daily

   index = 0
    @dailySummary = [],  @dailyLoTemp =  [], @dailyHiTemp = [], @dailySummary = [], 
    @dailyApparentLoTemp = [], @dailyApparentHiTemp = [], @dailyPrecipProb = [],
    dailyIcon = [], @dailySkycon = [], @dailyTime = []
      #5 times to include today and next 4 days
      8.times do
        @dailySummary[index] 		= dailyForecast.data[index].summary
        @dailyLoTemp[index] 		= dailyForecast.data[index].temperatureMin.round
        @dailyHiTemp[index] 		= dailyForecast.data[index].temperatureMax.round
        @dailyApparentLoTemp[index] = dailyForecast.data[index].apparentTemperatureMin.round
        @dailyApparentHiTemp[index] = dailyForecast.data[index].apparentTemperatureMax.round
        @dailyPrecipProb[index]		= (dailyForecast.data[index].precipProbability * 100).to_i
        @dailyTime[index]			= convert_time(dailyForecast.data[index].time)
        

        #Reformat forecast.io icon strings to be readable by skycons (upcase and underscores instead of dash)
        dailyIcon[index]		= dailyForecast.data[index].icon.upcase
		if dailyIcon[index]    == "PARTLY-CLOUDY-DAY"
			@dailySkycon[index] = "PARTLY_CLOUDY_DAY"		
		elsif dailyIcon[index] == "PARTLY-CLOUDY-NIGHT"
			@dailySkycon[index] = "PARTLY_CLOUDY_NIGHT"
		elsif dailyIcon[index] == "CLEAR-DAY"
			@dailySkycon[index] = "CLEAR_DAY"
		elsif dailyIcon[index] == "CLEAR-NIGHT"
			@dailySkycon[index] = "CLEAR_NIGHT"
		elsif dailyIcon[index] == "CLOUDY"
			@dailySkycon[index] = dailyIcon[index]
		elsif dailyIcon[index] == "RAIN"
			@dailySkycon[index] = dailyIcon[index]
		elsif dailyIcon[index] == "SLEET"
			@cdailySkycon[index] = dailyIcon[index]
		elsif dailyIcon[index] == "SNOW"
			@dailySkycon[index] = dailyIcon[index]
		elsif dailyIcon[index] == "WIND"
			@dailySkycon[index] = dailyIcon[index]
		elsif dailyIcon[index] == "FOG"
			@dailySkycon[index] = dailyIcon[index]			 			 			 			 			 			
		end


        index = index + 1
      end





	  # @dailyHiTemp = dailyForecast
	  @weekSummary = dailyForecast.summary

	 
		else
			#do nothing, no cookie/location data

		end




	end  



end
