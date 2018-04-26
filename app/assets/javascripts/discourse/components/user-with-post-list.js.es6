import { observes } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
    tagName: 'table',
    classNames: ['topic-list']

    // @observes('users.[]')
    // usersAdded() {
    //     // special case so we don't keep scanning huge lists
    //     if (!this.get('lastVisitedUser')) {
    //         this.refreshLastVisited();
    //     }
    // },
    //
    // @observes('users')
    // lastVisitedUsersChanged() {
    //     this.refreshLastVisited();
    // },
    //
    // _updateLastVisitedUser(users) {
    //
    //     this.set('lastVisitedUser', null);
    //
    //     if (!this.get('highlightLastVisited')) {
    //         return;
    //     }
    //
    //     let user = Discourse.User.current();
    //     if (!user || !user.previous_visit_at) {
    //         return;
    //     }
    //
    //     let lastVisitedUser, user;
    //
    //     let prevVisit = user.get('previousVisitAt');
    //
    //     // this is more efficient cause we keep appending to list
    //     // work backwards
    //     let start = 0;
    //     //alert(topics[start].get('pinned'));
    //     while(users[start] && users[start].get('pinned')) {
    //         start++;
    //     }
    //
    //     let i;
    //     for(i=topics.length-1;i>=start;i--){
    //         if (topics[i].get('bumpedAt') > prevVisit) {
    //             lastVisitedTopic = topics[i];
    //             break;
    //         }
    //         topic = topics[i];
    //     }
    //
    //     if (!lastVisitedTopic || !topic) {
    //         return;
    //     }
    //
    //     // end of list that was scanned
    //     if (topic.get('bumpedAt') > prevVisit) {
    //         return;
    //     }
    //
    //     this.set('lastVisitedTopic', lastVisitedTopic);
    // },
    //
    // refreshLastVisited() {
    //     this._updateLastVisitedTopic(this.get('topics'), this.get('order'), this.get('ascending'), this.get('top'));
    // },
});
