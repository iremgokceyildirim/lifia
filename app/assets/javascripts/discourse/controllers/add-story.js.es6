import { ajax } from 'discourse/lib/ajax';
import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { setting } from 'discourse/lib/computed';
import { on } from 'ember-addons/ember-computed-decorators';
import StoryValidation from "discourse/mixins/story-validation";
import { userPath } from 'discourse/lib/url';
//import Category from 'discourse/models/category';

export default Ember.Controller.extend(ModalFunctionality, StoryValidation,{
    complete: false,
    formSubmitted: false,
    accountStory: null,

    resetForm() {
        // We wrap the fields in a structure so we can assign a value
        this.setProperties({
            accountStory: '',
            authOptions: null,
            complete: false,
            formSubmitted: false
        });
    },

    submitDisabled: function() {
        if (this.get('formSubmitted')) return true;
        if (this.get('storyValidation.failed')) return true;

        return false;
    }.property('storyValidation.failed', 'formSubmitted'),


    storyRequired: function() {
        return this.get('siteSettings.story_required');
    }.property(),

    @on('init')
    fetchConfirmationValue() {
        const $hidden_login_form = $('#hidden-login-form');
        this.set('accountUsername', $hidden_login_form.find('input[name=username]').val());

        return ajax(userPath('hp.json')).then(json => {
            this.set('accountPasswordConfirm', json.value);
            this.set('accountChallenge', json.challenge.split("").reverse().join(""));
        });
    },

    actions: {
        externalLogin(provider) {
            this.get('login').send('externalLogin', provider);
        },

        skip() {
            const $hidden_login_form = $('#hidden-login-form');
            $hidden_login_form.submit();
        },

        addStory() {
            const self = this,
                attrs = this.getProperties('accountStory');

            attrs.category = 11; //TODO: Discourse.Category.findBySlug("story").id;

            const $hidden_login_form = $('#hidden-login-form');
            attrs.accountUsername = $hidden_login_form.find('input[name=username]').val();

            this.set('formSubmitted', true);
            // Ember.run.next(function() {
            //     e.send('createNewTopicViaParams', attrs.accountUsername + "'s Story", attrs.accountStory, Category.findBySlug("story").id, Category.findBySlug("story"), null);
            // });
            return Discourse.User.addStory(attrs).then(function(result) {
                if (result.success) {
                    alert("Successfully submitted your story!");
                    const $hidden_login_form = $('#hidden-login-form');
                    $hidden_login_form.submit();
                } else {
                    self.set('formSubmitted', false);
                    if (result.errors)
                        self.flash(result.errors[0], 'error');
                    else
                        self.flash(I18n.t('add_story.failed'), 'error');
                }
            }, function(e) {
                self.set('formSubmitted', false);
                if (e.jqXHR.responseJSON && e.jqXHR.responseJSON.errors) {
                    return self.flash(e.jqXHR.responseJSON.errors[0], 'error');
                } else {
                    return self.flash(I18n.t('add_story.failed'), 'error');
                }
            });
        }
    }

});
