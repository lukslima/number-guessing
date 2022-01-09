import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
  @service session;
  @tracked username = '';

  @action
  async goTo(route) {
    if (this.username.trim() == '') {
      alert('You are required to fill the username');
      return;
    }

    await this.session.login(this.username);

    this.transitionToRoute(route);
  }
}
