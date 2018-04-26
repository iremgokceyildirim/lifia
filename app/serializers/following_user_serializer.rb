class FollowingUserSerializer < BasicUserSerializer
  attributes :latest_post

  def latest_post
    if object.posts
      FollowingUserPostSerializer.new(object.posts.last, scope: scope, root: false, add_title: true).as_json
    end
  end
end
