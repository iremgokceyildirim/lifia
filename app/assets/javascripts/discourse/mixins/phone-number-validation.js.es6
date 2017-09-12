import InputValidation from 'discourse/models/input-validation';
import { setting } from 'discourse/lib/computed';
import { default as computed } from 'ember-addons/ember-computed-decorators';


export default Ember.Mixin.create({

    @computed('phoneNumber')
    phoneNumberValidation() {
        alert("here");
        var TEN_DIGITS_FORMAT = /\d{3}-\d{3}-\d{4}/;////^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        var phoneNumber = this.get('phoneNumber');
        alert(phoneNumber);
        alert(phoneNumber != null);
        if (phoneNumber != null) {
            alert(TEN_DIGITS_FORMAT.test(phoneNumber));
            if (!TEN_DIGITS_FORMAT.test(phoneNumber)) {
                return InputValidation.create({
                    failed: true,
                    reason: I18n.t('user.phone_number.format_error')
                });
            }
        }

        if (Ember.isEmpty(phoneNumber)) {
            return InputValidation.create({
                failed: true
            });
        }

        else {
            return InputValidation.create({
                ok: true,
                reason: I18n.t('user.phone_number.ok')
            });
        }


    }
});
