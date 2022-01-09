import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { roundedPercentage } from '../utils/math';

export default class UserModel extends Model {
  @attr('string') name;
  @attr('number') totalGames;
  @attr('number') totalWins;

  @computed('totalWins', 'totalGames')
  get percentageWins() {
    if (this.totalGames == 0) {
      return 0;
    }

    return roundedPercentage(this.totalWins, this.totalGames);
  }

  @computed('totalLoses', 'totalGames')
  get percentageLoses() {
    if (this.totalGames == 0) {
      return 0;
    }

    return roundedPercentage(this.totalLoses, this.totalGames);
  }

  @computed('totalGames', 'totalWins')
  get totalLoses() {
    return this.totalGames - this.totalWins;
  }
}
