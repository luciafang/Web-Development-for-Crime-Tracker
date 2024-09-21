class HomeController < ApplicationController
    def index
        @open_investigations = Investigation.is_open.chronological
    end
  
    def about

    end
  
    def contact

    end
  
    def privacy

    end

    def search
        redirect_back(fallback_location: home_path) if params[:query].blank?
        @query = params[:query]
        @search_results = SearchService.new(query: @query).results
    end
end
  