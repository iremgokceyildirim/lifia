import { ajax } from 'discourse/lib/ajax';
import Category from "discourse/models/category";
import Post from "discourse/models/post";
import Topic from "discourse/models/topic";

export default Discourse.Route.extend({
    model() {
        return ajax("/following/people.json").then(result => {
            result.users = result.user_list.users.map(function (u) {
                u.latest_post = Post.create(u.latest_post)
                u.latest_post.topic = Topic.create(u.latest_post.topic);
                u.latest_post.category = Category.findById(u.latest_post.category_id);
                return Em.Object.create(u);
            });

            return Em.Object.create(result);
        });
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
        },

        removeFollowingUser(user) {
            console.log("following people route");
            //let userToRemove = model.findBy('id', user.id)

            //alert(userToRemove.id);
            //model.removeObject(user);
            //alert(model.length);
            this.refresh();
        },
    }
});
