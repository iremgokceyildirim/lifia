import { ajax } from 'discourse/lib/ajax';
export default Discourse.Route.extend({
    model() {
        return ajax("/library.json").then(result => result.library);
    },

    titleToken() {
        return I18n.t('library.simple_title');
    },

    actions: {
        didTransition() {
            this.controllerFor("application").set("showFooter", true);
            return true;
        }
    }
});
