import RestrictedUserRoute from "discourse/routes/restricted-user";

export default RestrictedUserRoute.extend({
    model: function() {
        return this.modelFor('user');
    },

    renderTemplate: function() {
        this.render({ into: 'user' });
    },

    setupController: function(controller, model) {
        var phone_number = model.get('phone_number');
        if(phone_number){
            var phone_number_a = phone_number.match(/^(\d{3})(\d{3})(\d{4})$/);
            phone_number = phone_number_a[1] + "-" + phone_number_a[2] + "-" + phone_number_a[3];
        }

        controller.setProperties({ model: model, accountPhoneNumber: phone_number });
    }
});

