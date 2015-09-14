class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
end


  def convert_time(time)
  	time = Time.at(time).to_date.strftime("%A")
  end