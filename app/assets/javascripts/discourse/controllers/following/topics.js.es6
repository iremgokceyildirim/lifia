import FollowingController from 'discourse/controllers/following';

export default Ember.Controller.extend({
    hasTopics: Em.computed.gt('model.topics.length', 0),
});
