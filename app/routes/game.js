import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GameRoute extends Route {
  @service session;

  beforeModel() {
    if (this.session.currentUser == undefined) {
      alert('you are not logged in');
      this.transitionTo('index');
    }
  }

  setupController(controller, _model) {
    controller.newGame();
  }
}
