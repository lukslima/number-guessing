import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SessionService extends Service {
  @service store;
  @tracked currentUser;

  async setup() {
    const userId = window.localStorage.getItem('currentUserId');

    if (userId) {
      this.currentUser = await this.store.findRecord('user', userId);
    }
  }

  async login(username) {
    this.currentUser = await this._findUser(username);

    if (this.currentUser == undefined) {
      this.currentUser = await this._createNewUser(username);
    }

    window.localStorage.setItem('currentUserId', this.currentUser.id);
  }

  async _findUser(username) {
    const users = await this.store.query('user', {
      filter: {
        name: username,
      },
    });

    return users.firstObject;
  }

  async _createNewUser(username) {
    const newUser = this.store.createRecord('user', {
      name: username,
      totalGames: 0,
      totalWins: 0,
    });

    return newUser.save();
  }
}
