export default Discourse.Route.extend({
    setupController(controller, model) {
        controller.set('recommended', model);
    }
});
