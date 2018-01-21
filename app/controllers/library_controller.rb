class LibraryController < ApplicationController
  skip_before_action :check_xhr, only: [:index]


  def index
    @library = Library.new

    respond_to do |format|
      format.html do
        render :index
      end
      format.json do
        render_serialized(@library, LibrarySerializer)
      end
    end
  end

  def create

  end
end
