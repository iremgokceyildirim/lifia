import { ajax } from 'discourse/lib/ajax';
export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        return ajax("/following/topics").then(result => result.topic_list);
        //return this.store.findFiltered('topicList', {filter: 'topics/followed-by/'});
    },

    actions: {
        didTransition() {
            this.controllerFor("application").set("showFooter", true);
            return true;
        }
    }
});
