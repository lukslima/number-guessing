import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import resetStorages from 'ember-local-storage/test-support/reset-storage';

module('Acceptance | index', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function() {
    await visit('/');
  });

  hooks.afterEach(function() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
    resetStorages();
  });

  test('visiting /', async function (assert) {
    assert.strictEqual(currentURL(), '/');
  });

  test('it goes to game page when clicked on start game button', async function (assert) {
    fillIn('[data-test-username-field]', 'Pro User');

    await click('[data-test-start-game-button]');

    assert.strictEqual(currentURL(), '/game');
  });

  test('it goes to statistics page when clicked on see statistics button', async function (assert) {
    fillIn('[data-test-username-field]', 'Pro User');

    await click('[data-test-statistics-button]');

    assert.strictEqual(currentURL(), '/statistics');
  });

  // test('it does not allow going to any page without filling username field', async function (assert) {
  //   fillIn('[data-test-username-field]', '');

  //   await click('[data-test-statistics-button]');

  //   assert.strictEqual(currentURL(), '/');
  // });
});
