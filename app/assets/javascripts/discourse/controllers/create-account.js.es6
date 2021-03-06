import { ajax } from 'discourse/lib/ajax';
import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { setting } from 'discourse/lib/computed';
import { on } from 'ember-addons/ember-computed-decorators';
import { emailValid } from 'discourse/lib/utilities';
import InputValidation from 'discourse/models/input-validation';
import PasswordValidation from "discourse/mixins/password-validation";
import UsernameValidation from "discourse/mixins/username-validation";
import NameValidation from "discourse/mixins/name-validation";
import UserFieldsValidation from "discourse/mixins/user-fields-validation";
import PhoneNumberTypeValidation from "discourse/mixins/phone-number-validation";
import VerificationCodeValidation from "discourse/mixins/phone-number-validation";
import PhoneNumberExistenceValidation from "discourse/mixins/phone-number-validation";
import InvitationCodeValidation from "discourse/mixins/invitation-code-validation";
import { userPath } from 'discourse/lib/url';
import Composer from 'discourse/models/composer';
import Category from 'discourse/models/category';

export default Ember.Controller.extend(ModalFunctionality, PasswordValidation, UsernameValidation, NameValidation, UserFieldsValidation, PhoneNumberTypeValidation, PhoneNumberExistenceValidation, VerificationCodeValidation, InvitationCodeValidation,{
  login: Ember.inject.controller(),
  composer: Ember.inject.controller(),

  complete: false,
  accountPasswordConfirm: 0,
  accountChallenge: 0,
  formSubmitted: false,
  rejectedEmails: Em.A([]),
  prefilledUsername: null,
  userFields: null,
  accountPhoneNumber: '',
  verificationCode: '',
  invitationCode: '',
  isDeveloper: false,

  hasAuthOptions: Em.computed.notEmpty('authOptions'),
  canCreateLocal: setting('enable_local_logins'),
  showCreateForm: Em.computed.or('hasAuthOptions', 'canCreateLocal'),

  resetForm() {
    // We wrap the fields in a structure so we can assign a value
    this.setProperties({
      accountName: '',
      accountEmail: '',
      accountUsername: '',
      accountPassword: '',
      accountPhoneNumber: '',
      authOptions: null,
      complete: false,
      formSubmitted: false,
      rejectedEmails: [],
      rejectedPasswords: [],
      prefilledUsername: null,
      isDeveloper: false,
      verificationCode: '',
      invitationCode: ''
    });
    this._createUserFields();
  },

  submitDisabled: function() {
    if (!this.get('emailValidation.failed') && !this.get('passwordRequired')) return false; // 3rd party auth
    if (this.get('formSubmitted')) return true;
    if (this.get('nameValidation.failed')) return true;
    if (this.get('emailValidation.failed')) return true;
    if (this.get('usernameValidation.failed')) return true;
    if (this.get('passwordValidation.failed')) return true;
    if (this.get('phoneNumberExistenceValidation.failed')) return true;
    if (this.get('invitationCodeValidation.failed')) return true;
    if (this.get('userFieldsValidation.failed')) return true;

    return false;
  }.property('passwordRequired', 'nameValidation.failed', 'emailValidation.failed', 'usernameValidation.failed', 'passwordValidation.failed', 'phoneNumberExistenceValidation.failed', 'invitationCodeValidation.failed', 'userFieldsValidation.failed', 'formSubmitted'),


    sendVerificationDisabled: function() {
        if (this.get('phoneNumberTypeValidation.failed')) return true;
        return false;
    }.property('phoneNumberTypeValidation.failed'),

  // isHotline: function() {
  //    //alert (this.get("isHotline"));
  //    if(this.get("isHotline"))
  //        return true;
  //    else
  //        return false;
  // }.property(),

  usernameRequired: Ember.computed.not('authOptions.omit_username'),

  fullnameRequired: function() {
    return this.get('siteSettings.full_name_required') || this.get('siteSettings.enable_names');
  }.property(),

  passwordRequired: function() {
    return Ember.isEmpty(this.get('authOptions.auth_provider'));
  }.property('authOptions.auth_provider'),

  disclaimerHtml: function() {
    return I18n.t('create_account.disclaimer', {
      tos_link: this.get('siteSettings.tos_url') || Discourse.getURL('/tos'),
      privacy_link: this.get('siteSettings.privacy_policy_url') || Discourse.getURL('/privacy')
    });
  }.property(),

  // Check the email address
  emailValidation: function() {
    // If blank, fail without a reason
    let email;
    if (Ember.isEmpty(this.get('accountEmail'))) {
      return InputValidation.create({
        failed: true
      });
    }

    email = this.get("accountEmail");

    if (this.get('rejectedEmails').includes(email)) {
      return InputValidation.create({
        failed: true,
        reason: I18n.t('user.email.invalid')
      });
    }

    if ((this.get('authOptions.email') === email) && this.get('authOptions.email_valid')) {
      return InputValidation.create({
        ok: true,
        reason: I18n.t('user.email.authenticated', {
          provider: this.authProviderDisplayName(this.get('authOptions.auth_provider'))
        })
      });
    }

    if (emailValid(email)) {
      return InputValidation.create({
        ok: true,
        reason: I18n.t('user.email.ok')
      });
    }

    return InputValidation.create({
      failed: true,
      reason: I18n.t('user.email.invalid')
    });
  }.property('accountEmail', 'rejectedEmails.[]'),

  emailValidated: function() {
    return this.get('authOptions.email') === this.get("accountEmail") && this.get('authOptions.email_valid');
  }.property('accountEmail', 'authOptions.email', 'authOptions.email_valid'),

  authProviderDisplayName(provider) {
    switch(provider) {
      case "Google_oauth2": return "Google";
      default: return provider;
    }
  },

  prefillUsername: function() {
    if (this.get('prefilledUsername')) {
      // If username field has been filled automatically, and email field just changed,
      // then remove the username.
      if (this.get('accountUsername') === this.get('prefilledUsername')) {
        this.set('accountUsername', '');
      }
      this.set('prefilledUsername', null);
    }
    if (this.get('emailValidation.ok') && (Ember.isEmpty(this.get('accountUsername')) || this.get('authOptions.email'))) {
      // If email is valid and username has not been entered yet,
      // or email and username were filled automatically by 3rd parth auth,
      // then look for a registered username that matches the email.
      this.fetchExistingUsername();
    }
  }.observes('emailValidation', 'accountEmail'),

  @on('init')
  fetchConfirmationValue() {
    return ajax(userPath('hp.json')).then(json => {
      this.set('accountPasswordConfirm', json.value);
      this.set('accountChallenge', json.challenge.split("").reverse().join(""));
    });
  },

  actions: {
    externalLogin(provider) {
      this.get('login').send('externalLogin', provider);
    },

      /**
       Sends an verification code SMS to the currently entered mobile phone number

       @method verifyMobilePhone
       **/
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

    createAccount() {
      const self = this,
          attrs = this.getProperties('accountName', 'accountEmail', 'accountPassword', 'accountUsername', 'verificationCode', 'invitationCode', 'accountPhoneNumber', 'accountPasswordConfirm', 'accountChallenge'),
          userFields = this.get('userFields');

      // Add the userfields to the data
      if (!Ember.isEmpty(userFields)) {
        attrs.userFields = {};
        userFields.forEach(function(f) {
          attrs.userFields[f.get('field.id')] = f.get('value');
        });
      }

      this.set('formSubmitted', true);
      return Discourse.User.createAccount(attrs).then(function(result) {
        self.set('isDeveloper', false);
        if (result.success) {
          // Trigger the browser's password manager using the hidden static login form:
          const $hidden_login_form = $('#hidden-login-form');
          $hidden_login_form.find('input[name=username]').val(attrs.accountUsername);
          $hidden_login_form.find('input[name=password]').val(attrs.accountPassword);
          $hidden_login_form.find('input[name=redirect]').val(userPath('account-created'));
          self.send("showAddStory");
          self.resetForm();
          self.set('formSubmitted', false);
          //$hidden_login_form.submit();
        } else {
          self.flash(result.message || I18n.t('create_account.failed'), 'error');
          if (result.is_developer) {
            self.set('isDeveloper', true);
          }
          if (result.errors && result.errors.email && result.errors.email.length > 0 && result.values) {
            self.get('rejectedEmails').pushObject(result.values.email);
          }
          if (result.errors && result.errors.password && result.errors.password.length > 0) {
            self.get('rejectedPasswords').pushObject(attrs.accountPassword);
          }
          self.set('formSubmitted', false);
        }
        if (result.active && !Discourse.SiteSettings.must_approve_users) {
            return window.location.reload();
        }
      }, function() {
        self.set('formSubmitted', false);
        return self.flash(I18n.t('create_account.failed'), 'error');
      });
    },

    showPhoneVerification() {
      const self = this,
          attrs = this.getProperties('accountName', 'accountEmail', 'accountPassword', 'accountUsername', 'verificationCode', 'accountPhoneNumber', 'accountPasswordConfirm', 'accountChallenge'),
          userFields = this.get('userFields');

      // Add the userfields to the data
      if (!Ember.isEmpty(userFields)) {
          attrs.userFields = {};
          userFields.forEach(function(f) {
              attrs.userFields[f.get('field.id')] = f.get('value');
          });
      }

      this.set('formSubmitted', true);
      return Discourse.User.createAccount(attrs).then(function(result) {
          self.set('isDeveloper', false);
          if (result.success) {
              // Trigger the browser's password manager using the hidden static login form:
              const $hidden_login_form = $('#hidden-login-form');
              $hidden_login_form.find('input[name=username]').val(attrs.accountUsername);
              $hidden_login_form.find('input[name=password]').val(attrs.accountPassword);
              $hidden_login_form.find('input[name=redirect]').val(userPath('account-created'));
              $hidden_login_form.submit();
          } else {
              self.flash(result.message || I18n.t('create_account.failed'), 'error');
              if (result.is_developer) {
                  self.set('isDeveloper', true);
              }
              if (result.errors && result.errors.email && result.errors.email.length > 0 && result.values) {
                  self.get('rejectedEmails').pushObject(result.values.email);
              }
              if (result.errors && result.errors.password && result.errors.password.length > 0) {
                  self.get('rejectedPasswords').pushObject(attrs.accountPassword);
              }
              self.set('formSubmitted', false);
          }
          if (result.active && !Discourse.SiteSettings.must_approve_users) {
              return window.location.reload();
          }
      }, function() {
          self.set('formSubmitted', false);
          return self.flash(I18n.t('create_account.failed'), 'error');
      });
    }
  }

});
