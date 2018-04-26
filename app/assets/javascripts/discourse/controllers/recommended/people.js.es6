export default Ember.Controller.extend({
    hasUsers: Em.computed.gt('model.users.length', 0),
    order: 'default',
    ascending: false,


    actions: {

    }
});
