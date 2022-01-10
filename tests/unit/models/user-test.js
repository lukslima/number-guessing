import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | user', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');

    this.user = this.store.createRecord('user', {
      name: 'John',
      totalGames: 10,
      totalWins: 3
    });
  });

  test('it exists', function (assert) {
    let model = this.store.createRecord('user', {});
    assert.ok(model);
  });

  test('it has a computed percentageWins', function (assert) {
    assert.equal(this.user.percentageWins, 30);

    this.user.totalWins = 4;

    assert.equal(this.user.percentageWins, 40);
  });

  test('it has a computed percentageLoses', function (assert) {
    assert.equal(this.user.percentageLoses, 70);

    this.user.totalWins = 4;

    assert.equal(this.user.percentageLoses, 60);
  });

  test('it has a computed totalLoses', function (assert) {
    assert.equal(this.user.totalLoses, 7);

    this.user.totalWins = 4;

    assert.equal(this.user.totalLoses, 6);
  });
});
