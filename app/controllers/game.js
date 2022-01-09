import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { randomUpTo } from '../utils/math';

export default class GameController extends Controller {
  @tracked userGuess;
  @tracked secretNumber;

  @service statistics;

  @computed('secretNumber', 'userGuess')
  get result() {
    if (this.secretNumber == null) {
      return null;
    }

    if (this.secretNumber == this.userGuess) {
      return 'Correct';
    }

    return 'Wrong';
  }

  @computed('result', 'secretNumber', 'userGuess')
  get resultPhrase() {
    if (this.result == 'Correct') {
      return 'Congratulations!!!';
    }

    const aux = this.userGuess > this.secretNumber ? 'higher' : 'lower';

    return `Your guess is ${aux} then the secret number.`;
  }

  @action
  guess() {
    if (this.userGuess < 0 || this.userGuess > 10) {
      alert('Invalid Number: Please choose a number between 0 and 10');
      this.userGuess = '';
      return;
    }

    this.secretNumber = randomUpTo(10);

    this.statistics.increment({
      result: this.result,
      secretNumber: this.secretNumber,
      userGuess: this.userGuess,
    });
  }

  @action
  newGame() {
    this.userGuess = null;
    this.secretNumber = null;
  }
}
