import { ajax } from 'discourse/lib/ajax';
import CategoryList from "discourse/models/category-list";
import PreloadStore from 'preload-store';

export default Discourse.Route.extend({
    model() {
        return ajax("/following/categories").then(result => {
            result.category_list.categories.forEach(c => {
                c.stat = `<span class="value">${c.topics_all_time}</span>`;
            });

            return CategoryList.create({
                categories: CategoryList.categoriesFrom(this.store, result),
                can_create_category: result.category_list.can_create_category,
                can_create_topic: result.category_list.can_create_topic,
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
        }
    }
});
