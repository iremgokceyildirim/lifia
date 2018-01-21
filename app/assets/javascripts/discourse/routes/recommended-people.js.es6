import { ajax } from 'discourse/lib/ajax';
export default Discourse.Route.extend({
    model() {
        return ajax("/recommended/people.json").then(result => result.user_list);
    },

    actions: {
        didTransition() {
            this.controllerFor("application").set("showFooter", true);
            return true;
        }
    }
});
