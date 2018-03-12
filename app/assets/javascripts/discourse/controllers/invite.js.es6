import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { emailValid } from 'discourse/lib/utilities';
import computed from 'ember-addons/ember-computed-decorators';
import Group from 'discourse/models/group';
import Invite from 'discourse/models/invite';

export default Ember.Controller.extend(ModalFunctionality, {
  userInvitedShow: Ember.inject.controller('user-invited-show'),

  // If this isn't defined, it will proxy to the user model on the preferences
  // page which is wrong.
  label: null,
  emailOrUsernameOrPhoneNumber: null,
  hasCustomMessage: false,
  customMessage: null,
  inviteIcon: "envelope",
  invitation_code: null,
  invitingExistingUserToTopic: false,

  @computed('isMessage', 'invitingToTopic')
  title(isMessage, invitingToTopic) {
    if (isMessage) {
      return 'topic.invite_private.title';
    } else if (invitingToTopic) {
      return 'topic.invite_reply.title';
    } else {
      return 'user.invited.create';
    }
  },

  @computed
  isAdmin() {
    return this.currentUser.admin;
  },

  @computed('isAdmin', 'label', 'emailOrUsernameOrPhoneNumber', 'invitingToTopic', 'isPrivateTopic', 'model.groupNames', 'model.saving', 'model.details.can_invite_to')
  disabled(isAdmin, label, emailOrUsernameOrPhoneNumber, invitingToTopic, isPrivateTopic, groupNames, saving, can_invite_to) {
    if (saving) return true;
    if(Ember.isEmpty(label)) return true;
    if (Ember.isEmpty(emailOrUsernameOrPhoneNumber)) return true;
    if (emailOrUsernameOrPhoneNumber.includes("@")){
        const emailTrimmed = emailOrUsernameOrPhoneNumber.trim();

        // when inviting to forum, email must be valid
        if (!invitingToTopic && !emailValid(emailTrimmed)) return true;
        // normal users (not admin) can't invite users to private topic via email
        if (!isAdmin && isPrivateTopic && emailValid(emailTrimmed)) return true;
        // when inviting to private topic via email, group name must be specified
        if (isPrivateTopic && Ember.isEmpty(groupNames) && emailValid(emailTrimmed)) return true;
    }
    else if (emailOrUsernameOrPhoneNumber.length < 10) //TODO: add phone_number validations here
        return true;


    if (can_invite_to) return false;
    return false;
  },

  @computed('isAdmin', 'label', 'emailOrUsernameOrPhoneNumber', 'model.saving', 'isPrivateTopic', 'model.groupNames', 'hasCustomMessage')
  disabledCopyLink(isAdmin, label, emailOrUsernameOrPhoneNumber, saving, isPrivateTopic, groupNames, hasCustomMessage) {
    if (hasCustomMessage) return true;
    if (saving) return true;
    if(Ember.isEmpty(label)) return true;
    if (Ember.isEmpty(emailOrUsernameOrPhoneNumber)) return true;
    if (emailOrUsernameOrPhoneNumber.includes("@")){
        const email = emailOrUsernameOrPhoneNumber.trim();
        // email must be valid
        if (!emailValid(email)) return true;
        // normal users (not admin) can't invite users to private topic via email
        if (!isAdmin && isPrivateTopic && emailValid(email)) return true;
        // when inviting to private topic via email, group name must be specified
        if (isPrivateTopic && Ember.isEmpty(groupNames) && emailValid(email)) return true;
    } else if (emailOrUsernameOrPhoneNumber.length < 10){
        return true;
    }

    return false;
  },

    @computed('isAdmin', 'label', 'emailOrUsernameOrPhoneNumber', 'model.saving', 'isPrivateTopic', 'model.groupNames', 'hasCustomMessage')
    disabledGenerateInvitation(isAdmin, label, emailOrUsernameOrPhoneNumber, saving, isPrivateTopic, groupNames, hasCustomMessage) {
        if (!Ember.isEmpty(emailOrUsernameOrPhoneNumber)) return true;
        if(Ember.isEmpty(label)) return true;
        return false;
    },

  @computed('model.saving')
  buttonTitle(saving) {
    return saving ? 'topic.inviting' : 'topic.invite_reply.action';
  },

  // We are inviting to a topic if the model isn't the current user.
  // The current user would mean we are inviting to the forum in general.
  @computed('model')
  invitingToTopic(model) {
    return model !== this.currentUser;
  },

  @computed('model', 'model.details.can_invite_via_email')
  canInviteViaEmail(model, can_invite_via_email) {
    return (this.get('model') === this.currentUser) ?
            true :
            can_invite_via_email;
  },

  @computed('isMessage', 'canInviteViaEmail')
  showCopyInviteButton(isMessage, canInviteViaEmail) {
    return (canInviteViaEmail && !isMessage);
  },

  topicId: Ember.computed.alias('model.id'),

  // Is Private Topic? (i.e. visible only to specific group members)
  isPrivateTopic: Em.computed.and('invitingToTopic', 'model.category.read_restricted'),

  // Is Private Message?
  isMessage: Em.computed.equal('model.archetype', 'private_message'),

  // Allow Existing Members? (username autocomplete)
  allowExistingMembers: Ember.computed.alias('invitingToTopic'),

  @computed("isAdmin", "model.group_users")
  isGroupOwnerOrAdmin(isAdmin, groupUsers) {
    return isAdmin || (groupUsers && groupUsers.some(groupUser => groupUser.owner));
  },

  // Show Groups? (add invited user to private group)
  @computed('isGroupOwnerOrAdmin', 'emailOrUsername', 'isPrivateTopic', 'isMessage', 'invitingToTopic', 'canInviteViaEmail')
  showGroups(isGroupOwnerOrAdmin, emailOrUsername, isPrivateTopic, isMessage, invitingToTopic, canInviteViaEmail) {
    return isGroupOwnerOrAdmin &&
           canInviteViaEmail &&
           !isMessage &&
           (emailValid(emailOrUsername) || isPrivateTopic || !invitingToTopic);
  },

  @computed('emailOrUsername')
  showCustomMessage(emailOrUsername) {
    return (this.get('model') === this.currentUser || emailValid(emailOrUsername));
  },

  // Instructional text for the modal.
  @computed('isMessage', 'invitingToTopic', 'emailOrUsername', 'isPrivateTopic', 'isAdmin', 'canInviteViaEmail')
  inviteInstructions(isMessage, invitingToTopic, emailOrUsername, isPrivateTopic, isAdmin, canInviteViaEmail) {
    if (!canInviteViaEmail) {
      // can't invite via email, only existing users
      return I18n.t('topic.invite_reply.sso_enabled');
    } else if (isMessage) {
      // inviting to a message
      return I18n.t('topic.invite_private.email_or_username');
    } else if (invitingToTopic) {
      // inviting to a private/public topic
      if (isPrivateTopic && !isAdmin) {
        // inviting to a private topic and is not admin
        return I18n.t('topic.invite_reply.to_username');
      } else {
        // when inviting to a topic, display instructions based on provided entity
        if (Ember.isEmpty(emailOrUsername)) {
          return I18n.t('topic.invite_reply.to_topic_blank');
        } else if (emailValid(emailOrUsername)) {
          this.set("inviteIcon", "envelope");
          return I18n.t('topic.invite_reply.to_topic_email');
        } else {
          this.set("inviteIcon", "hand-o-right");
          return I18n.t('topic.invite_reply.to_topic_username');
        }
      }
    } else {
      // inviting to forum
      return I18n.t('topic.invite_reply.to_forum');
    }
  },

  @computed('isPrivateTopic')
  showGroupsClass(isPrivateTopic) {
    return isPrivateTopic ? 'required' : 'optional';
  },

  groupFinder(term) {
    return Group.findAll({ term: term, ignore_automatic: true });
  },

  @computed('isMessage', 'emailOrUsernameOrPhoneNumber', 'invitingExistingUserToTopic')
  successMessage(isMessage, emailOrUsernameOrPhoneNumber, invitingExistingUserToTopic) {
    if (this.get('hasGroups')) {
      return I18n.t('topic.invite_private.success_group');
    } else if (isMessage) {
      return I18n.t('topic.invite_private.success');
    } else if (invitingExistingUserToTopic) {
      return I18n.t('topic.invite_reply.success_existing_email', { emailOrUsernameOrPhoneNumber });
    } else if (emailOrUsernameOrPhoneNumber.includes("@") && emailValid(emailOrUsernameOrPhoneNumber)) {
      return I18n.t('topic.invite_reply.success_email', { emailOrUsernameOrPhoneNumber });
    } else if (/^\d+$/.test(emailOrUsernameOrPhoneNumber)) {
        return I18n.t('topic.invite_reply.success_sms', { emailOrUsernameOrPhoneNumber });
    } else if (emailOrUsernameOrPhoneNumber){
        return I18n.t('topic.invite_reply.success_username');
    } else {
      return "Copy this code down and give it to the contact directly. Once you dismiss this dialog, you will no longer be able to recover this code."
    }
  },

  @computed('isMessage')
  errorMessage(isMessage) {
    return isMessage ? I18n.t('topic.invite_private.error') : I18n.t('topic.invite_reply.error');
  },

  @computed('canInviteViaEmail')
  placeholderKey(canInviteViaEmail) {
    return (canInviteViaEmail) ?
            'topic.invite_private.email_or_username_placeholder' :
            'topic.invite_reply.username_placeholder';
  },

  @computed
  customMessagePlaceholder() {
    return I18n.t('invite.custom_message_placeholder');
  },

  // Reset the modal to allow a new user to be invited.
  reset() {
    this.set('label', null);
    this.set('emailOrUsernameOrPhoneNumber', null);
    this.set('hasCustomMessage', false);
    this.set('customMessage', null);
    this.set('invitation_code', null);
    this.set('invitingExistingUserToTopic', false);
    this.get('model').setProperties({
      groupNames: null,
      error: false,
      saving: false,
      finished: false,
      inviteLink: null
    });
  },

  actions: {

    createInvite() {
      const self = this;
      if (this.get('disabled')) { return; }

      const groupNames = this.get('model.groupNames'),
            userInvitedController = this.get('userInvitedShow'),
            model = this.get('model');

      model.setProperties({ saving: true, error: false });

      const onerror = function(e) {
        if (e.jqXHR.responseJSON && e.jqXHR.responseJSON.errors) {
          self.set("errorMessage", e.jqXHR.responseJSON.errors[0]);
        } else {
          self.set("errorMessage", self.get('isMessage') ? I18n.t('topic.invite_private.error') : I18n.t('topic.invite_reply.error'));
        }
        model.setProperties({ saving: false, error: true });
      };

      if (this.get('hasGroups')) {
        return this.get('model').createGroupInvite(this.get('emailOrUsernameOrPhoneNumber').trim()).then((data) => {
          model.setProperties({ saving: false, finished: true });
          this.get('model.details.allowed_groups').pushObject(Ember.Object.create(data.group));
          this.appEvents.trigger('post-stream:refresh');

        }).catch(onerror);

      } else {

        return this.get('model').createInvite(this.get('emailOrUsernameOrPhoneNumber').trim(), this.get('label'), groupNames, this.get('customMessage')).then(result => {

              if (!this.get('invitingToTopic')) {
                Invite.findInvitedBy(this.currentUser, userInvitedController.get('filter')).then(invite_model => {
                  userInvitedController.set('model', invite_model);
                  userInvitedController.set('totalInvites', invite_model.invites.length);
                  //alert(result);
                  this.set('invitation_code', result);
                  //alert(invite_model.invites[0].invite_key);
                  //userInvitedController.set('leftInvitationCount', Discourse.SiteSettings.max_invites_per_month - invite_model.invites.length);
                  userInvitedController.send('calculateLeftInvitationCount');
                  //this.set('invitation_code', invite_model.invites[0].invite_key);
                  //TODO: Update left invitation number
                });
              } else if (this.get('isMessage') && result && result.user) {
                this.get('model.details.allowed_users').pushObject(Ember.Object.create(result.user));
                this.appEvents.trigger('post-stream:refresh');
              } else if (this.get('invitingToTopic') && emailValid(this.get('emailOrUsernameOrPhoneNumber').trim()) && result && result.user) {
                this.set('invitingExistingUserToTopic', true);
              }

              model.setProperties({ saving: false, finished: true });
            }).catch(onerror);
      }
    },

      generateInvitationCode() {
          const self = this;

          const groupNames = this.get('model.groupNames'),
              userInvitedController = this.get('userInvitedShow'),
              model = this.get('model');

          var topicId = null;
          if (this.get('invitingToTopic')) {
              topicId = this.get('model.id');
          }

          model.setProperties({ saving: true, error: false });

          return this.get('model').generateInvitationCode(this.get('label').trim(), this.get('customMessage'), groupNames, topicId).then(result => {
              model.setProperties({ saving: false, finished: true, inviteCode: result});
              Invite.findInvitedBy(this.currentUser, 'pending').then(invite_model => {
                  userInvitedController.set('model', invite_model);
                  userInvitedController.set('totalInvites', invite_model.invites.length);
                  //alert(result);
                  this.set('invitation_code', result);
                  this.set('label', invite_model.invites[0].label)
                  userInvitedController.send('calculateLeftInvitationCount');
                  //this.set('invitation_code', invite_model.invites[0].invite_key); // or result
              });
          }).catch(function(e) {
              if (e.jqXHR.responseJSON && e.jqXHR.responseJSON.errors) {
                  self.set("errorMessage", e.jqXHR.responseJSON.errors[0]);
              } else {
                  self.set("errorMessage", self.get('isMessage') ? I18n.t('topic.invite_private.error') : I18n.t('topic.invite_reply.error'));
              }
              model.setProperties({ saving: false, error: true });
          });
      },

    generateInvitelink() {
      const self = this;

      if (this.get('disabled')) { return; }

      const groupNames = this.get('model.groupNames'),
            userInvitedController = this.get('userInvitedShow'),
            model = this.get('model');

      var topicId = null;
      if (this.get('invitingToTopic')) {
        topicId = this.get('model.id');
      }

      model.setProperties({ saving: true, error: false });

      return this.get('model').generateInviteLink(this.get('emailOrUsernameOrPhoneNumber').trim(), groupNames, topicId).then(result => {
              model.setProperties({ saving: false, finished: true, inviteLink: result });
              Invite.findInvitedBy(this.currentUser, userInvitedController.get('filter')).then(invite_model => {
                userInvitedController.set('model', invite_model);
                userInvitedController.set('totalInvites', invite_model.invites.length);
                //alert(result);
                this.set('invitation_code', result);
                userInvitedController.send('calculateLeftInvitationCount');
              });
            }).catch(function(e) {
              if (e.jqXHR.responseJSON && e.jqXHR.responseJSON.errors) {
                self.set("errorMessage", e.jqXHR.responseJSON.errors[0]);
              } else {
                self.set("errorMessage", self.get('isMessage') ? I18n.t('topic.invite_private.error') : I18n.t('topic.invite_reply.error'));
              }
              model.setProperties({ saving: false, error: true });
            });
    },

    showCustomMessageBox() {
      this.toggleProperty('hasCustomMessage');
      if (this.get('hasCustomMessage')) {
        if (this.get('model') === this.currentUser) {
          this.set('customMessage', I18n.t('invite.custom_message_template_forum'));
        } else {
          this.set('customMessage', I18n.t('invite.custom_message_template_topic'));
        }
      } else {
        this.set('customMessage', null);
      }
    }
  }

});
