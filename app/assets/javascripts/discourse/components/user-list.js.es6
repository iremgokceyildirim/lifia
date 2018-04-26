import { observes } from 'ember-addons/ember-computed-decorators';
import { findRawTemplate } from 'discourse/lib/raw-templates';

export default Ember.Component.extend({
    tagName: 'table',
    classNames: ['user-list'],

    _init: function(){
        this.addObserver('order', this.rerender);
        this.addObserver('ascending', this.rerender);
        //this.refreshLastVisited();
    }.on('init'),

    sortable: function(){
        return !!this.get('changeSort');
    }.property(),

    skipHeader: function() {
        return this.site.mobileView;
    }.property(),

    // @observes('users', 'order', 'ascending')
    // lastVisitedUserChanged() {
    //     this.refreshLastVisited();
    // },
    //
    // _updateLastVisitedUser(users, order, ascending) {
    //
    //     this.set('lastVisitedUser', null);
    //
    //     if (!this.get('highlightLastVisited')) {
    //         return;
    //     }
    //
    //     if (!users || users.length === 1) {
    //         return;
    //     }
    //
    //     if (ascending) {
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
    //     while(users[start]) {
    //         start++;
    //     }
    //
    //     let i;
    //     for(i=users.length-1;i>=start;i--){
    //         if (users[i].get('lastSeenAt') > prevVisit) {
    //             lastVisitedUser = users[i];
    //             break;
    //         }
    //         user = users[i];
    //     }
    //
    //     if (!lastVisitedUser || !user) {
    //         return;
    //     }
    //
    //     // end of list that was scanned
    //     if (user.get('lastSeenAt') > prevVisit) {
    //         return;
    //     }
    //
    //     this.set('lastVisitedUser', lastVisitedUser);
    // },
    //
    // refreshLastVisited() {
    //     this._updateLastVisitedUser(this.get('users'), this.get('order'), this.get('ascending'));
    // },
});
