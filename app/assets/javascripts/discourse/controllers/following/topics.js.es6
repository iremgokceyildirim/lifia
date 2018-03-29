export default Ember.Controller.extend({
    hasTopics: Em.computed.gt('model.topics.length', 0),
});
