class AssignmentsController < ApplicationController
    before_action :check_login
    authorize_resource
  
    # GET /assignments
    def new
      @officer = Officer.find(params[:officer_id])
      @officer_investigations = Investigation.all
      @assignment = Assignment.new
    end
  
    # POST /assignments
    def create
      @assignment = Assignment.new(assignment_params)
      @assignment.start_date = Date.current
    
      if @assignment.save
        flash[:notice] = "Successfully added assignment."
        Rails.logger.debug "Redirecting to officer with ID: #{@assignment.officer_id}"
        redirect_to officer_path(@assignment.officer_id)
      else
        # Set @officer again in case of failure
        Rails.logger.debug "Assignment save failed: #{@assignment.errors.full_messages.join(', ')}"
        @officer = Officer.find(params[:assignment][:officer_id])
        @investigations = Investigation.alphabetical.is_open.to_a
        render :new
      end
    end
    
    # DELETE /assignments
    def terminate
      @assignment = Assignment.find(params[:id])
      if @assignment.terminate
        flash[:notice] = "Successfully terminated assignment."
      # else
      #   flash[:alert] = "Failed to terminate assignment."
      end
      redirect_to officer_path(@assignment.officer)
    end
  
    private
  
    def assignment_params
      params.require(:assignment).permit(:officer_id, :investigation_id, :start_date, :end_date)
    end
  end
  