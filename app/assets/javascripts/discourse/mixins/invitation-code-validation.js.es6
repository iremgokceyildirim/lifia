import InputValidation from 'discourse/models/input-validation';
import { on, default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Mixin.create({

    invitationCodeLength: 6,

    @computed('invitationCode')
    invitationCodeValidation() {

        // If blank, fail without a reason
        if (Ember.isEmpty(this.get('invitationCode'))) {
            return InputValidation.create({
                failed: true,
                //reason: I18n.t('create_account.invitation_code.empty')
            });
        }

        else {
            if(this.get('invitationCode').length != this.invitationCodeLength){
                return InputValidation.create({
                    failed: true,
                    reason: I18n.t('create_account.invitation_code.length_error', {count: this.invitationCodeLength})
                });
            }
            else{
                return InputValidation.create({
                    ok: true
                });
            }

        }
    }
});
