class OfficersController < ApplicationController
    before_action :set_officer, only: [:show, :edit, :update, :destroy]
    before_action :check_login
    authorize_resource
  
    def index
      @active_officers = Officer.active.alphabetical.paginate(page: params[:page]).per_page(20)
      @inactive_officers = Officer.inactive.alphabetical.paginate(page: params[:page]).per_page(20)
    end
  
    def show
        @current_assignments = @officer.assignments.current.chronological
        @past_assignments = @officer.assignments.past.chronological
    end
  
    def new
      @officer = Officer.new
    end
  
    def create
      @officer = Officer.new(officer_params)
      if @officer.save
        flash[:notice] = "Successfully created #{officer_params[:first_name]} #{officer_params[:last_name]}."
        redirect_to officer_path(@officer)
      else
        render :new
      end
    end
  
    def edit
    end
  
    def update
      if @officer.update(officer_params)
        redirect_to officer_path(@officer)
      else
        render :edit
      end
    end
  
    def destroy
        @officer = Officer.find(params[:id])
        
        if @officer.assignments.current.any?
          # Setup for showing the officer again
          # @current_assignments = @officer.assignments.where("end_date IS NULL")
          # @past_assignments = @officer.assignments.where("end_date IS NOT NULL")
          flash[:alert] = "Officer has active assignments and cannot be deleted."
          render :show
        else
          @officer.destroy
          flash[:notice] = "Removed #{@officer.proper_name} from the system."
          redirect_to officers_path

        end
    end      
    
  
    private
  
    def set_officer
      @officer = Officer.find(params[:id])
    end
  
    def officer_params
      params.require(:officer).permit(:active, :ssn, :rank, :first_name, :last_name, :unit_id, :username, :role, :password, :password_confirmation)
    end
end
  