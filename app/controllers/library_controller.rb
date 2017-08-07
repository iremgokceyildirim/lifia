class LibraryController < ApplicationController
  skip_before_filter :check_xhr, only: [:index]


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
end
