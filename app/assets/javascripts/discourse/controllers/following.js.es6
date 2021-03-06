export default Ember.Controller.extend({
    followingTopics: Ember.inject.controller('following/topics'),
    navigationCategory: Ember.inject.controller('navigation/category'),
    application: Ember.inject.controller(),

    loading: false,

    category: Em.computed.alias('navigationCategory.category'),
    noSubcategories: Em.computed.alias('navigationCategory.noSubcategories'),

    loadedAllItems: Em.computed.not("followingTopics.model.canLoadMore"),

    _showFooter: function() {
        this.set("application.showFooter", this.get("loadedAllItems"));
    }.observes("loadedAllItems"),

});
