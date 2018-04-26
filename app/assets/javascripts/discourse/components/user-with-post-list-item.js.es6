

export default Ember.Component.extend({
    tagName: 'tr',
    classNameBindings: [':topic-list-item', 'unboundClassNames', ':visited'], //TODO: access topic's visited through user_data
    attributeBindings: ['data-user-id'],
    'data-user-id': Em.computed.alias('user.id'),
});
