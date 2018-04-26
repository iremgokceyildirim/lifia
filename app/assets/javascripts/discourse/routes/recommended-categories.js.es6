import { ajax } from 'discourse/lib/ajax';
import Topic from 'discourse/models/topic';
import CategoryList from 'discourse/models/category-list';

export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        //return ajax("/following/topics").then(result => Ember.Object.create(result.topic_list));
        return ajax("/recommended/categories").then(result => {

                return CategoryList.create({
                    categories: CategoryList.categoriesFrom(this.store, result),
                    can_create_category: false,
                    can_create_topic: false,
                    draft_key: result.category_list.draft_key,
                    draft: result.category_list.draft,
                    draft_sequence: result.category_list.draft_sequence
                });
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
