import { propertyEqual } from 'discourse/lib/computed';
import InputValidation from 'discourse/models/input-validation';
import PhoneNumberTypeValidation from "discourse/mixins/phone-number-validation";
import VerificationCodeValidation from "discourse/mixins/phone-number-validation";
import PhoneNumberExistenceValidation from "discourse/mixins/phone-number-validation";
import { emailValid } from 'discourse/lib/utilities';
import computed from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
    taken: false,
    saving: false,
    error: false,
    success: false,
    newPhoneNumber: null,
    accountPhoneNumber: null,
    verificationCode: null,

    newPhoneNumberEmpty: Em.computed.empty('newPhoneNumber'),
    saveDisabled: Em.computed.or('saving', 'newPhoneNumberEmpty', 'taken', 'unchanged', 'invalidPhoneNumber'),
    unchanged: propertyEqual('newEmailLower', 'currentUser.email'),

    newEmailLower: function() {
        return this.get('accountPhoneNumber').toLowerCase().trim();
    }.property('newEmail'),

    saveButtonText: function() {
        if (this.get('saving')) return I18n.t("saving");
        return I18n.t("user.change");
    }.property('saving'),

    @computed('accountPhoneNumber')
    invalidPhoneNumber(accountPhoneNumber) {
        return !emailValid(accountPhoneNumber);
    },

    @computed('invalidPhoneNumber')
    emailValidation(invalidPhoneNumber) {
        if (invalidEmail) {
            return InputValidation.create({
                failed: true,
                reason: I18n.t('user.email.invalid')
            });
        }
    },

    sendVerificationDisabled: function() {
        if (this.get('phoneNumberTypeValidation.failed')) return true;
        return false;
    }.property('phoneNumberTypeValidation.failed'),

    actions: {
        sendVerificationCode() {
            var self = this;

            this.setProperties({
                sendingSMS: true,
                sentSMS: false
            });

            ajax("/send_verification_sms", {
                type: 'POST',
                data: { phone_number: this.get('accountPhoneNumber').replace(/\D/g, '')}
            }).then(function () {
                self.set('sentSMS', true);
            }, function(e) {
                if (e.jqXHR.responseJSON && e.jqXHR.responseJSON.errors) {
                    bootbox.alert(I18n.t('sms.error', { server_error: e.jqXHR.responseJSON.errors[0] }));
                } else {
                    bootbox.alert("There was a problem sending the sms message."); //I18n.t('sms.send_error')
                }
            }).finally(function() {
                self.set('sendingSMS', false);
            });
        },

        updatePhoneNumber: function() {
            var self = this;
            this.set('saving', true);
            return this.get('content').changePhoneNumber(this.get('accountPhoneNumber')).then(function() {
                self.set('success', true);
            }, function(e) {
                self.setProperties({ error: true, saving: false });
                if (e.jqXHR.responseJSON && e.jqXHR.responseJSON.errors && e.jqXHR.responseJSON.errors[0]) {
                    self.set('errorMessage', e.jqXHR.responseJSON.errors[0]);
                } else {
                    self.set('errorMessage', I18n.t('user.change_phone_number.error'));
                }
            });
        }
    }

});
