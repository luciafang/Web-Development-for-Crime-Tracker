class InvestigationNotesController < ApplicationController
    before_action :check_login
    authorize_resource

    def new
      @investigation_note = InvestigationNote.new
      @investigation = Investigation.find_by(id: params[:investigation_id])
    end
  
    def create
      @investigation_note = InvestigationNote.new(investigation_note_params)
    #   @investigation_note.officer = @officer 
      if @investigation_note.save
        flash[:notice] = "Successfully added investigation note."
        redirect_to investigation_path(@investigation_note.investigation)
      else
        render :new
      end
    end
  
    private
  
    def investigation_note_params
      params.require(:investigation_note).permit(:officer_id, :investigation_id, :content)
    end
end
  