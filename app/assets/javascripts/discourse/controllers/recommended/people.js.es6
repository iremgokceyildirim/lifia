export default Ember.Controller.extend({

    actions: {
        loadSimilarities() {
            this.get("model").users.length;
        }
    }
});
