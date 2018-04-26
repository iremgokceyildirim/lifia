
export default Ember.Controller.extend({
    hasUsers: Em.computed.gt('model.users.length', 0),

    actions: {
        removeFollowingUser(user){
            console.log("people controller");
            //let userToRemove = model.findBy('id', user.id);

            //this.sendAction('removeFollowingUser', user);
        }
    }
});
