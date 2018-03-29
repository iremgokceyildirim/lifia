import RestrictedUserRoute from "discourse/routes/restricted-user";
import User from 'discourse/models/user';

export default RestrictedUserRoute.extend({

  setupController(controller, user) {
    controller.reset();
    controller.setProperties({
      model: user,
      newNameInput: user.get('name')
      //adminUser: User.findByUsername('iremgokceaydin',{ stats: false })
    });
  }
});
