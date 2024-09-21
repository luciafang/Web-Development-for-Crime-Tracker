class SuspectsController < ApplicationController
    before_action :check_login
    authorize_resource
  
    def new
        @investigation = Investigation.find_by(id: params[:investigation_id])
        @suspect = Suspect.new
        @current_suspects = @investigation.suspects.current
    end
  
    def create
        @suspect = Suspect.new(suspect_params)
        if @suspect.save
            flash[:notice] = "Successfully added suspect."
            redirect_to investigation_path(@suspect.investigation)
        else
            # puts @suspect.errors.full_messages
            @investigations = Investigation.all
            render :new
        end
    end
  
    def terminate
        @suspect = Suspect.find(params[:id])
        if @suspect.update(dropped_on: Date.current)
            flash[:notice] = "Suspect successfully terminated."
            redirect_to investigation_path(@suspect.investigation)
        else
            flash[:alert] = "Failed to terminate suspect."
            redirect_to investigation_path(@suspect.investigation)
        end
    end
  
    private
  
    def set_investigation
      @investigation = Investigation.find_by(id: params[:investigation_id])
      unless @investigation
        flash[:alert] = "Investigation not found."
        redirect_to root_path and return
      end
    end
  
    # def set_suspect
    #   @suspect = Suspect.find_by(id: params[:id])
    #   unless @suspect
    #     flash[:alert] = "Suspect not found."
    #     redirect_to root_path and return
    #   end
    # end

    def suspect_params
        params.require(:suspect).permit(:criminal_id, :investigation_id, :added_on)
    end
    
end
  