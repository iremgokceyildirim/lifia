import { ajax } from 'discourse/lib/ajax';
import Topic from 'discourse/models/topic';

export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        //return ajax("/following/topics").then(result => Ember.Object.create(result.topic_list));
        return ajax("/recommended/topics").then(result => {
            result.topics = result.topic_view.suggested_topics.map(function (u) {
                return Topic.create(u);
            });

            return Em.Object.create(result);
        });
        //return this.store.findFiltered('topicList', {filter: 'topics/followed-by/'});
    },

    setupController(controller, model) {
        controller.set("model", model);

        this.controllerFor('navigation/default').setProperties({
            'canCreateTopic': false,
            'isFollowingActive': '',
            'isRecommendedActive': 'active'
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

        createTopic() {
            //this.openComposer(this.controllerFor("discovery/topics"));
        },
    }
});
