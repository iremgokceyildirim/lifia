import { ajax } from 'discourse/lib/ajax';
import TopicList from 'discourse/models/topic-list';

export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        //return ajax("/following/topics").then(result => Ember.Object.create(result.topic_list));
        return ajax("/following/topics").then(result => TopicList.create(result));
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
