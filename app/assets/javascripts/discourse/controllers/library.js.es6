export default Ember.Controller.extend({

    contactInfo: function() {
        if (this.siteSettings.contact_url) {
            return I18n.t('library.contact_info', {contact_info: "<a href='"+ this.siteSettings.contact_url +"' target='_blank'>"+ this.siteSettings.contact_url +"</a>"});
        } else if (this.siteSettings.contact_email) {
            return I18n.t('library.contact_info', {contact_info: this.siteSettings.contact_email});
        } else {
            return null;
        }
    }.property()
});
