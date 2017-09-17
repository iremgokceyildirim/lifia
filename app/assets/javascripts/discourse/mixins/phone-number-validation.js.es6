import InputValidation from 'discourse/models/input-validation';
import { setting } from 'discourse/lib/computed';
import { on, default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Mixin.create({

    maxPhoneNumberLength: 12,
    maxVerificationCodeLength: 6,
    // @on('init')
    // _createMobilePhoneField() {
    //     if (!this.site) { return; }
    //
    //     let userFields = this.site.get('user_fields');
    //     var phoneNumber;
    //     if (userFields) {
    //         phoneNumber = userFields.findBy('name', "Mobile phone");
    //         alert("aa"+phoneNumber.name);
    //         return Ember.Object.create({ value: null, field: phoneNumber });
    //     }
    //
    //     this.set('phoneNumber', phoneNumber);
    // },

    @computed('accountPhoneNumber')
    phoneNumberValidation() {
        alert("here");
        var phoneNumber = this.get('accountPhoneNumber');
        var TEN_DIGITS_FORMAT = /\d{3}-\d{3}-\d{4}/;////^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        alert(phoneNumber);
        alert(phoneNumber != '');
        if (phoneNumber != '') {
            alert(TEN_DIGITS_FORMAT.test(phoneNumber));
            if (!TEN_DIGITS_FORMAT.test(phoneNumber)) {
                return InputValidation.create({
                    failed: true,
                    reason: I18n.t('user.phone_number.format_error')
                });
            }
            // If too long
            // if (phoneNumber.replace(/\D/g, '').length > this.get('maxPhoneNumberLength')) { // or /[^0-9]/g
            //     return InputValidation.create({
            //         failed: true,
            //         reason: I18n.t('user.phone_number.too_long')
            //     });
            // }
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
    },

    @computed('verification_code')
    verificationCodeValidation() {
        alert("here");

    }
});
