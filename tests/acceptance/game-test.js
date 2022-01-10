import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import resetStorages from 'ember-local-storage/test-support/reset-storage';

module('Acceptance | game', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function() {
    const session = this.owner.lookup('service:session');
    session.login('Cool User');
    
    await visit('/game');
  });

  hooks.afterEach(function() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
    resetStorages();
  });

  test('visiting /game', async function (assert) {
    assert.strictEqual(currentURL(), '/game');
  });

  test('it shows correct message when user make a correct guess', async function (assert) {
    fillIn('[data-test-user-guess-field]', '5');

    await click('[data-test-guess-button]');

    const gameController = this.owner.lookup('controller:game');
    gameController.secretNumber = '5';

    await settled();

    assert.dom('[data-test-result-text]').hasText('Correct Guess!');
    assert.dom('[data-test-user-guess-text]').hasText('Your Guess: 5');
    assert.dom('[data-test-secret-number-text]').hasText('Secret Number: 5');
    assert.dom('[data-test-result-phrase-text]').hasText('Congratulations!!!');
  });

  test('it shows correct message when user make a wrong guess', async function (assert) {
    fillIn('[data-test-user-guess-field]', '7');

    await click('[data-test-guess-button]');

    const gameController = this.owner.lookup('controller:game');
    gameController.secretNumber = '3';

    await settled();

    assert.dom('[data-test-result-text]').hasText('Wrong Guess!');
    assert.dom('[data-test-user-guess-text]').hasText('Your Guess: 7');
    assert.dom('[data-test-secret-number-text]').hasText('Secret Number: 3');
    assert.dom('[data-test-result-phrase-text]').hasText('Your guess is higher then the secret number.');
  });

  test('it does not allow user to input an invalid number', async function (assert) {
    assert.strictEqual(currentURL(), '/game');
  });

  test('it goes to index page when clicked on back to home button', async function (assert) {
    await click('[data-test-back-to-home-button]');

    assert.strictEqual(currentURL(), '/');
  });

  test('it increments the statistics when clicked on guess button', async function (assert) {
    assert.expect(1);

    const statistics = this.owner.lookup('service:statistics');

    statistics.increment = () => {
      assert.ok(true, 'it incremented the statistics')
    };

    fillIn('[data-test-user-guess-field]', '5');

    await click('[data-test-guess-button]');
  });

  test('it goes to statistics page when clicked on end game button', async function (assert) {
    fillIn('[data-test-user-guess-field]', '5');

    await click('[data-test-guess-button]');

    await click('[data-test-end-game-button]');

    assert.strictEqual(currentURL(), '/statistics');
  });

  test('it starts a new game when clicked on play again button', async function (assert) {
    assert.dom('[data-test-result-div]').doesNotExist();
    assert.dom('[data-test-user-guess-field]').exists();

    fillIn('[data-test-user-guess-field]', '5');

    await click('[data-test-guess-button]');

    assert.dom('[data-test-result-div]').exists();
    assert.dom('[data-test-user-guess-field]').doesNotExist();
    
    await click('[data-test-play-again-button]');

    assert.dom('[data-test-result-div]').doesNotExist();
    assert.dom('[data-test-user-guess-field]').exists();
  });
});
