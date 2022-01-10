import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import resetStorages from 'ember-local-storage/test-support/reset-storage';

module('Unit | Service | statistics', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.statistics = this.owner.lookup('service:statistics');
    this.store = this.owner.lookup('service:store');
  });

  hooks.afterEach(function() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
    resetStorages();
  });

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:statistics');
    assert.ok(service);
  });

  test('#setup loads saved data from localStorege', async function (assert) {
    const user = this.store.createRecord('user', {
      name: 'John',
      totalGames: 10,
      totalWins: 3
    });

    await user.save();

    const statistics = {
      totalGames: 100,
      totalWins: 35,
      secretNumberOccurrences: { 0: 5, 1: 10, 2: 20 },
      userGuessOccurrences: { 0: 5, 1: 10, 2: 20 },
      topPlayersIds: [user.id],
    };

    window.localStorage.setItem('gameStatistics', JSON.stringify(statistics));

    assert.equal(this.statistics.totalGames, 0);
    assert.equal(this.statistics.totalWins, 0);
    assert.deepEqual(this.statistics.secretNumberOccurrences, {});
    assert.deepEqual(this.statistics.userGuessOccurrences, {});
    assert.deepEqual(this.statistics.topPlayers, []);

    await this.statistics.setup();

    assert.equal(this.statistics.totalGames, statistics.totalGames);
    assert.equal(this.statistics.totalWins, statistics.totalWins);
    assert.deepEqual(this.statistics.secretNumberOccurrences, statistics.secretNumberOccurrences);
    assert.deepEqual(this.statistics.userGuessOccurrences, statistics.userGuessOccurrences);
    // assert.deepEqual(this.statistics.topPlayers, [user]);
  });
});
