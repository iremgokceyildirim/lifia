export default Ember.Controller.extend({
  topic: Ember.inject.controller(),
  application: Ember.inject.controller(),
    followingPeopleController: Ember.inject.controller('following/people'),

  actions: {
      removeFollowingUser(user) {
          console.log("user-card controller");
          //followingPeopleController.send('removeFollowingUser', user);
      },

    togglePosts(user) {
      const topicController = this.get('topic');
      topicController.send('toggleParticipant', user);
    },

    showUser(user) {
      this.transitionToRoute('user', user);
    }
  }
});
