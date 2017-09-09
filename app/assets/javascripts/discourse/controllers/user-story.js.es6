import { exportUserArchive } from 'discourse/lib/export-csv';

export default Ember.Controller.extend({
    application: Ember.inject.controller(),
    user: Ember.inject.controller(),

    userActionType: null,
    currentPath: Ember.computed.alias('application.currentPath'),
    viewingSelf: Ember.computed.alias("user.viewingSelf")

});
