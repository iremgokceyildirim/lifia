import RestrictedUserRoute from "discourse/routes/restricted-user";

export default RestrictedUserRoute.extend({
    model: function() {
        return this.modelFor('user');
    },

    renderTemplate: function() {
        this.render({ into: 'user' });
    },

    setupController: function(controller, model) {
        controller.setProperties({ model: model, accountPhoneNumber: model.get('phone_number') });
    },

    // A bit odd, but if we leave to /preferences we need to re-render that outlet
    deactivate: function() {
        this._super();
        this.render('preferences', { into: 'user', controller: 'preferences' });
    }
});

