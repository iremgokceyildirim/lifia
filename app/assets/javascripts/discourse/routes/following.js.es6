import { scrollTop } from "discourse/mixins/scroll-top";
export default Discourse.Route.extend({
    setupController(controller, model) {
        controller.set('following', model);
    },
    //
    // renderTemplate: function() {
    //     this.render();
    //     this.render('navigation-bar', {    // render the `hero` template
    //         into: 'following',
    //         outlet: 'navigation-bar'  // using the outlet named `hero`
    //     });
    // }

    actions: {
        loading() {
            this.controllerFor("following").set("loading", true);
            return true;
        },

        loadingComplete() {
            this.controllerFor("following").set("loading", false);
            if (!this.session.get("topicListScrollPosition")) {
                scrollTop();
            }
        },

        didTransition() {
            this.controllerFor("following")._showFooter();
            this.send("loadingComplete");
            return true;
        },

        createTopic() {
            //this.openComposer(this.controllerFor("discovery/topics"));
        },
    }

});
