export default Ember.Controller.extend({
    hasTopics: Em.computed.gt('model.topics.length', 0),
    order: 'default',
    ascending: false,

    actions: {

        changeSort(sortBy) {
            if (sortBy === this.get('order')) {
                this.toggleProperty('ascending');
            } else {
                this.setProperties({order: sortBy, ascending: false});
            }

            this.get('model').refreshSort(sortBy, this.get('ascending'));
        },
    }
});
