import { ajax } from 'discourse/lib/ajax';
import Topic from 'discourse/models/topic';
import CategoryList from 'discourse/models/category-list';

export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        //return ajax("/following/topics").then(result => Ember.Object.create(result.topic_list));
        return ajax("/recommended/categories").then(result => {
            result.forEach(c => {
                c.stat = `<span class="value">${c.topics_all_time}</span>`;

                return CategoryList.create({
                    categories: CategoryList.categoriesFrom(this.store, result),
                    can_create_category: result.category_list.can_create_category,
                    can_create_topic: result.category_list.can_create_topic,
                    draft_key: result.category_list.draft_key,
                    draft: result.category_list.draft,
                    draft_sequence: result.category_list.draft_sequence
                });
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
