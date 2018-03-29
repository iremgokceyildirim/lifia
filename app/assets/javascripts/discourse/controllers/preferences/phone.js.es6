import { propertyEqual } from 'discourse/lib/computed';
import { ajax } from 'discourse/lib/ajax';
import { on } from 'ember-addons/ember-computed-decorators';
import InputValidation from 'discourse/models/input-validation';
import PhoneNumberTypeValidation from "discourse/mixins/phone-number-validation";
import VerificationCodeValidation from "discourse/mixins/phone-number-validation";
import PhoneNumberExistenceValidation from "discourse/mixins/phone-number-validation";
import { emailValid } from 'discourse/lib/utilities';

export default Ember.Controller.extend(PhoneNumberTypeValidation, VerificationCodeValidation, PhoneNumberExistenceValidation, {
    taken: false,
    saving: false,
    error: false,
    success: false,
    sentSMS: false,
    accountPhoneNumber: null,
    verificationCode: '',


    newPhoneNumberEmpty: Em.computed.empty('accountPhoneNumber'),
    saveDisabled: Em.computed.or('saving', 'taken', 'unchanged', 'phoneNumberTypeValidation.failed', 'verificationCodeValidation.failed'), //,
    unchanged: function(){
        if(this.get('accountPhoneNumber').replace(/\D/g, '') == this.get('model').phone_number)
            return true;
        return false;
    }.property('accountPhoneNumber'),

    saveButtonText: function() {
        if (this.get('saving')) return I18n.t("saving");
        return I18n.t("user.change");
    }.property('saving'),

    sendVerificationDisabled: function() {
        if (this.get('phoneNumberTypeValidation.failed') || this.get('unchanged')) return true;
        return false;
    }.property('accountPhoneNumber'),

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

        updatePhoneNumber() {
            var self = this;
            this.set('saving', true);
            return this.get('content').changePhoneNumber(self.get('accountPhoneNumber').replace(/\D/g, ''), self.get('verificationCode')).then(function(result) {
                if (result.success) {
                    self.setProperties({ error: false, saving: false });
                    self.set('success', true);
                }
                else{
                    self.setProperties({ error: true, saving: false });
                    self.set('errorMessage', result.message);
                }

            }, function(e) {
                self.setProperties({ error: true, saving: false });
                if (e.jqXHR.responseJSON && e.jqXHR.responseJSON.errors && e.jqXHR.responseJSON.errors[0]) {
                    self.set('errorMessage', e.jqXHR.responseJSON.errors[0]);
                } else {
                    self.set('errorMessage', I18n.t('user.change_phone_number.error'));
                }
            });
        },

        // composePrivateMessage() {
        //     adminUser = User.findByUsername('iremgokceaydin');
        //     alert(adminUser.username);
        //     //this.sendAction('composePrivateMessage', adminUser post);
        // }
    }

});
