export default Ember.Controller.extend({
    recommendedPeople: Ember.inject.controller('recommended/people'),
    navigationCategory: Ember.inject.controller('navigation/category'),
    application: Ember.inject.controller(),

    loading: false,
    loadedAllItems: Em.computed.not("recommendedPeople.model.canLoadMore"),

    _showFooter: function() {
        this.set("application.showFooter", this.get("loadedAllItems"));
    }.observes("loadedAllItems"),

});
