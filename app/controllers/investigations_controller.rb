class InvestigationsController < ApplicationController
    before_action :set_investigation, only: [:show, :edit, :update, :close_investigation]
    before_action :check_login
    authorize_resource
  
    def index
      @open_investigations = Investigation.where(date_closed: nil).alphabetical.paginate(page: params[:page], per_page: 10)
      @closed_investigations = Investigation.where.not(date_closed: nil).where(solved: true).alphabetical.paginate(page: params[:page], per_page: 10)
      @closed_unsolved = Investigation.where(date_closed: nil, solved: false).alphabetical.paginate(page: params[:page], per_page: 10)
      @with_batman = Investigation.where(batman_involved: true).alphabetical.paginate(page: params[:page], per_page: 10)
      @unassigned_cases = Investigation.left_joins(:assignments).where(assignments: { id: nil }).alphabetical.paginate(page: params[:page], per_page: 10)
    end
    
  
    def show
      @current_assignments = @investigation.assignments.where(end_date: nil)
    end
  
    def new
      @investigation = Investigation.new
    end
  
    def create
      @investigation = Investigation.new(investigation_params)
      if @investigation.save
        flash[:notice] = "Successfully added '#{@investigation.title}' to GCPD."
        redirect_to investigation_path(@investigation)
      else
        render :new
      end
    end
  
    def edit
    end
  
    def update
      if @investigation.update(investigation_params)
        flash[:notice] = "Investigation successfully updated."
        redirect_to investigation_path(@investigation)
      else
        render :edit
      end
    end
  
    # Custom method to handle closing of investigations
    def close_investigation
      @investigation.update(date_closed: Date.current, solved: true)
      flash[:notice] = "Investigation has been closed."
      redirect_to investigations_path
    end
  
    private
  
    def set_investigation
      @investigation = Investigation.find(params[:id])
    end
  
    def investigation_params
      params.require(:investigation).permit(:title, :description, :crime_location, :date_opened, :date_closed, :solved, :batman_involved)
    end
end
  