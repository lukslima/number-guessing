import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class StatisticsRoute extends Route {
  @service statistics;
  @service session;

  model() {
    return this.statistics;
  }

  beforeModel() {
    if (this.session.currentUser == undefined) {
      alert('you are not logged in');
      this.transitionTo('index');
    }
  }
}
