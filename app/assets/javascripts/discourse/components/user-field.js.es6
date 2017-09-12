import { fmt } from 'discourse/lib/computed';

export default Ember.Component.extend({
  classNameBindings: [':user-field', 'field.field_type'],
  layoutName: fmt('field.field_type', 'components/user-fields/%@'),

    isPhoneNumber: Ember.computed('field.name', function() {
        alert("hereA");
        return this.get('field.name') == "Mobile phone";
    }),

  noneLabel: function() {
    return 'user_fields.none';
  }.property()
});
