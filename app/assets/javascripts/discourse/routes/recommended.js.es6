export default Discourse.Route.extend({
    setupController(controller, model) {
        controller.set('recommended', model);
    },

    actions: {
        loading() {
            this.controllerFor("recommended").set("loading", true);
            return true;
        },

        loadingComplete() {
            this.controllerFor("recommended").set("loading", false);
        },

        didTransition() {
            this.controllerFor("recommended")._showFooter();
            this.send("loadingComplete");
            return true;
        }
    }
});
