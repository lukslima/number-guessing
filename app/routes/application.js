import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;
  @service statistics;

  async beforeModel() {
    await this.session.setup();
    await this.statistics.setup();
  }
}
