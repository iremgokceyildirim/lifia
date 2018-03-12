import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';
import { userPath } from 'discourse/lib/url';

const InvitationCode = Discourse.Model.extend({

    generate() {
        return ajax(userPath(user.get('username_lower') + "/invitation-codes.json"), {data}).then(function (result) {
            return Em.Object.create(result);
        });
    },

    rescind() {
        ajax('/invitation_codes', {
            type: 'DELETE',
            data: { code: this.get('code') }
        });
        this.set('rescinded', true);
    }

});

InvitationCode.reopenClass({

    findInvitationCodesBy(user) {
        if (!user) { return Em.RSVP.resolve(); }

        var data = {};

        return ajax(userPath(user.get('username_lower') + "/invitation_codes.json"), {data}).then(function (result) {
            return Em.Object.create(result);
        });
    }

});

export default InvitationCode;
