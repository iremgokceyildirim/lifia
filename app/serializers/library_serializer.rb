class LibrarySerializer < ApplicationSerializer

  attributes :description,
             :title,
             :locale,
             :version,
             :https
end
