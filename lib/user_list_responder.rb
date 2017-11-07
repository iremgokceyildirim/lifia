module UserListResponder
  def respond_with_user_list(list)
    #discourse_expires_in 1.minute

    #list.draft_key = Draft::NEW_TOPIC
    #list.draft_sequence = DraftSequence.current(current_user, Draft::NEW_TOPIC)
    #list.draft = Draft.get(current_user, list.draft_key, list.draft_sequence) if current_user

    respond_to do |format|
      format.html do
        @users = list.users
        #store_preloaded(list.preload_key, MultiJson.dump(UserListSerializer.new(list, scope: guardian)))
        render 'list/list_users'
      end
      format.json do
        render_serialized(list, UserListSerializer)

      end
    end
  end

end
