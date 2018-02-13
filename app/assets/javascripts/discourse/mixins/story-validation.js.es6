import InputValidation from 'discourse/models/input-validation';
import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Mixin.create({

    @computed()
    storyInstructions() {
        return I18n.t(this.siteSettings.story_required ? 'user.story.instructions_required' : 'user.story.instructions');
    },

    // Validate the name.
    @computed('accountStory')
    storyValidation() {
        if (this.siteSettings.story_required && Ember.isEmpty(this.get('accountStory'))) {
            return InputValidation.create({ failed: true });
        }

        return InputValidation.create({ok: true});
    }
});
