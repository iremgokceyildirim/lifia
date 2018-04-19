export default Ember.Component.extend({
    tagName: 'table',
    classNames: ['user-list'],

    skipHeader: function() {
        return this.site.mobileView;
    }.property(),
});
