import { ajax } from 'discourse/lib/ajax';
export default Discourse.Route.extend({
    model() {
        //return this.modelFor("user");
        return ajax("/recommended/people.json").then(result => result);
    },

    actions: {
        didTransition() {
            this.controllerFor("application").set("showFooter", true);
            return true;
        }
    }
});
