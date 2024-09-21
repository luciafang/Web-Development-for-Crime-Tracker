class CrimeInvestigationsController < ApplicationController
    before_action :check_login
    authorize_resource
  
    def new
        @crime_investigation = CrimeInvestigation.new
        @investigation = Investigation.find(params[:investigation_id])
        # @crime_investigation = CrimeInvestigation.new(investigation: @investigation)
        @crimes_list = Crime.all
    end
  
    def create
      @crime_investigation = CrimeInvestigation.new(crime_investigation_params)
      if @crime_investigation.save
        flash[:notice] = "Successfully added #{@crime_investigation.crime.name} to #{@crime_investigation.investigation.title}."
        redirect_to investigation_path(@crime_investigation.investigation)
      else
        # @crimes_list = Crime.all
        render :new
      end
    end
  
    def destroy
        @crime_investigation = CrimeInvestigation.find_by(id: params[:id])
        if @crime_investigation
          @investigation = @crime_investigation.investigation
          @crime_investigation.destroy
          redirect_to investigation_path(@investigation), notice: 'Successfully removed a crime from this investigation.'
        else
          redirect_to some_fallback_path, alert: 'Crime investigation not found.'
        end
    end
      
  
    private
  
    def set_crime_investigation
      @crime_investigation = CrimeInvestigation.find(params[:id])
    end
  
    def crime_investigation_params
      params.require(:crime_investigation).permit(:crime_id, :investigation_id)
    end
end
  