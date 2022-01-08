import EmberRouter from '@ember/routing/router';
import config from 'number-gessing/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('game');
  this.route('statistics');
});
