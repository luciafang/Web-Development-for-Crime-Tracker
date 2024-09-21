class UnitsController < ApplicationController
    before_action :set_unit, only: [:show, :edit, :update, :destroy]
    before_action :check_login
    authorize_resource
  
    def index
        @active_units = Unit.where(active: true).alphabetical
        @inactive_units = Unit.where(active: false).alphabetical
    end
  
    def show
        # @officers = @unit.officers
        @officers = @unit.officers.active.alphabetical.paginate(page: params[:page], per_page: 10)
    end
  
    def new
        @unit = Unit.new
    end
  
    def create
        @unit = Unit.new(unit_params)
        if @unit.save
            redirect_to units_path, notice: "Successfully added #{@unit.name} to GCPD."
        else
            render :new
      end
    end
  
    def edit
        @unit = Unit.find(params[:id])
    end
  
    def update
        @unit = Unit.find(params[:id])
        if @unit.update(unit_params)
            flash[:notice] = "Updated unit information."
            redirect_to @unit
        else
            render :edit
        end
    end
    
    def destroy
        @unit = Unit.find(params[:id])
        if @unit.officers.exists?
          @active_units = Unit.where(active: true)
          @inactive_units = Unit.where(active: false)
      
          flash[:alert] = 'Unit cannot be deleted because it has officers.'
          render :index
        else
            @unit.destroy
            flash[:notice] = "Removed #{@unit.name} from the system."
            redirect_to units_path

        end
    end
      
            
  
    private
  
    def set_unit
        @unit = Unit.find(params[:id])
    end
  
    def unit_params
        params.require(:unit).permit(:name, :active)
    end
  end
  