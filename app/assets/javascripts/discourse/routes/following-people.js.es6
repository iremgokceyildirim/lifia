import { ajax } from 'discourse/lib/ajax';
export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        return ajax("/following/people.json").then(result => result);
    },

    setupController(controller, model) {
        controller.set("model", model);

        this.controllerFor('navigation/default').setProperties({
            'canCreateTopic': false,
            'isFollowingActive': 'active',
            'isRecommendedActive': ''
        });
    },

    renderTemplate() {
        this.render();
        this.render("navigation/default", { outlet: "navigation-bar" });
    },

    actions: {
        didTransition() {
            this.controllerFor("application").set("showFooter", true);
            return true;
        },

        removeFollowingUser(user) {
            console.log("following people route");
            //let userToRemove = model.findBy('id', user.id)

            //alert(userToRemove.id);
            //model.removeObject(user);
            //alert(model.length);
            this.refresh();
        },
    }
});
