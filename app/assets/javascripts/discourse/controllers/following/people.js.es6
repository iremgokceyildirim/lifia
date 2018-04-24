
export default Ember.Controller.extend({
    // update: function() {
    //     console.log('model changed');
    // }.property('model'),

    actions: {
        removeFollowingUser(user){
            console.log("people controller");
            //let userToRemove = model.findBy('id', user.id);

            //this.sendAction('removeFollowingUser', user);
        }
    }
});
