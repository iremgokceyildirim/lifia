import { ajax } from 'discourse/lib/ajax';
export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        return ajax("/following/categories").then(result => {
            result.categories.forEach(c => {
                c.stat = `<span class="value">${c.topics_all_time}</span>`;
            });

            return result;
        });


        //return this.store.findFiltered('topicList', {filter: 'topics/followed-by/'});
    },

    setupController(controller, model) {
        controller.set("model", model);

        this.controllerFor('navigation/default').set('canCreateTopic', false);
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
