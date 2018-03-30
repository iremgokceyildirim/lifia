import { ajax } from 'discourse/lib/ajax';
export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        return ajax("/following/topics").then(result => result.topic_list);
        //return this.store.findFiltered('topicList', {filter: 'topics/followed-by/'});
    },

    setupController(controller, model) {
        controller.set("model", model);

        this.controllerFor('navigation/default').setProperties({
            'canCreateTopic': false,
            'isFollowingActive': 'active'
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
        }
    }
});
