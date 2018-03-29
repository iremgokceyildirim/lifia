

export default Ember.Controller.extend({
    followingTopics: Ember.inject.controller('following/topics'),
    navigationCategory: Ember.inject.controller('navigation/category'),
    application: Ember.inject.controller(),

    category: Em.computed.alias('navigationCategory.category'),
    noSubcategories: Em.computed.alias('navigationCategory.noSubcategories')

});
