import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import resetStorages from 'ember-local-storage/test-support/reset-storage';

module('Unit | Service | session', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.session = this.owner.lookup('service:session');
    this.store = this.owner.lookup('service:store');
  });

  hooks.afterEach(function() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
    resetStorages();
  });

  test('it exists', function (assert) {
    assert.ok(this.session);
  });

  test('#setup - it loads saved data from localStorege', async function (assert) {
    const user = this.store.createRecord('user', {
      name: 'John',
      totalGames: 10,
      totalWins: 3
    });

    await user.save();

    window.localStorage.setItem('currentUserId', user.id);

    assert.equal(this.session.currentUser, null);

    await this.session.setup();

    assert.deepEqual(this.session.currentUser, user);
  });

  test('#login - when user exists it updates the currentUser with it', async function (assert) {
    const user = this.store.createRecord('user', {
      name: 'John',
      totalGames: 10,
      totalWins: 3
    });

    await user.save();

    assert.equal(this.session.currentUser, null);

    await this.session.login(user.name);

    assert.deepEqual(this.session.currentUser, user);
  });

  test('#login - when user does not exist, it creates a new one then updates the currentUser with it', async function (assert) {
    let user = await this.store.queryRecord('user', {
      filter: {
        name: 'newUser'
      }
    });

    assert.notOk(user, 'user does not exist before login');
    
    await this.session.login('newUser');

    user = await this.store.queryRecord('user', {
      filter: {
        name: 'newUser'
      }
    });

    assert.ok(user, 'user exists after login');

    assert.deepEqual(this.session.currentUser, user);
  });

  test('#login - it saves the userId to localStorage', async function (assert) {
    const user = this.store.createRecord('user', {
      name: 'John',
      totalGames: 10,
      totalWins: 3
    });

    await user.save();

    let storedUserId = window.localStorage.getItem('currentUserId');

    assert.notEqual(user.id, storedUserId);
    
    await this.session.login(user.name)

    storedUserId = window.localStorage.getItem('currentUserId');
    
    assert.equal(user.id, storedUserId);
  });
});
