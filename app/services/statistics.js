import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { computed, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import { roundedPercentage } from '../utils/math';

export default class StatisticsService extends Service {
  @tracked totalGames = 0;
  @tracked totalWins = 0;
  secretNumberOccurrences = {};
  userGuessOccurrences = {};
  topPlayers = [];

  @service session;
  @service store;

  @alias('session.currentUser') currentUser;

  TOP_PLAYERS_MAX_LENGTH = 3;

  @computed('topPlayers.length', 'totalWins')
  get sortedTopPlayers() {
    if (this.topPlayers.length == 0) {
      return [];
    }

    return this.topPlayers.sort((player1, player2) => {
      if (player1.percentageWins < player2.percentageWins) {
        return 1;
      }
      if (player1.percentageWins > player2.percentageWins) {
        return -1;
      }

      return 0;
    });
  }

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
    if (this.totalGames == 0) {
      return 0;
    }

    return this.totalGames - this.totalWins;
  }

  @computed('secretNumberOccurrences', 'totalGames')
  get mostOftenSecretNumber() {
    return this._mostOftenFor(this.secretNumberOccurrences);
  }

  @computed('totalGames', 'userGuessOccurrences')
  get mostOftenUserGuess() {
    return this._mostOftenFor(this.userGuessOccurrences);
  }

  async setup() {
    const storedStatistics = window.localStorage.getItem('gameStatistics');

    if (storedStatistics) {
      const gameStatistics = JSON.parse(storedStatistics);
      this.totalGames = gameStatistics.totalGames;
      this.totalWins = gameStatistics.totalWins;
      set(
        this,
        'secretNumberOccurrences',
        gameStatistics.secretNumberOccurrences
      );
      set(this, 'userGuessOccurrences', gameStatistics.userGuessOccurrences);

      await gameStatistics.topPlayersIds.forEach(async (userId) => {
        const player = await this.store.findRecord('user', userId);
        this.topPlayers.push(player);
      });
    }
  }

  increment(gameResults) {
    this._incrementUserStats(gameResults);
    this._incrementOverallStats(gameResults);
  }

  _incrementUserStats({ result }) {
    this.currentUser.totalGames += 1;

    if (result == 'Correct') {
      this.currentUser.totalWins += 1;
    }

    this.currentUser.save();
  }

  _incrementOverallStats({ result, secretNumber, userGuess }) {
    this._incrementOccurrences(secretNumber, userGuess);
    this._updateTopPlayers();

    this.totalGames += 1;

    if (result == 'Correct') {
      this.totalWins += 1;
    }

    this._saveStats();
  }

  _incrementOccurrences(secretNumber, userGuess) {
    this.secretNumberOccurrences[secretNumber] = this.secretNumberOccurrences[
      secretNumber
    ]
      ? this.secretNumberOccurrences[secretNumber] + 1
      : 1;
    this.userGuessOccurrences[userGuess] = this.userGuessOccurrences[userGuess]
      ? this.userGuessOccurrences[userGuess] + 1
      : 1;
  }

  _updateTopPlayers() {
    if (this.topPlayers.includes(this.currentUser)) {
      return;
    }

    if (this.topPlayers.length < this.TOP_PLAYERS_MAX_LENGTH) {
      this.topPlayers.push(this.currentUser);
      return;
    }

    const lastTopPlayer = this.sortedTopPlayers.lastObject;

    if (this.currentUser.percentageWins > lastTopPlayer.percentageWins) {
      const index = this.topPlayers.indexOf(lastTopPlayer);

      this.topPlayers.splice(index, 1, this.currentUser);
    }
  }

  _saveStats() {
    const statistics = {
      totalGames: this.totalGames,
      totalWins: this.totalWins,
      secretNumberOccurrences: this.secretNumberOccurrences,
      userGuessOccurrences: this.userGuessOccurrences,
      topPlayersIds: this.topPlayers.map((player) => player.id),
    };

    window.localStorage.setItem('gameStatistics', JSON.stringify(statistics));
  }

  _mostOftenFor(occurrencesHash) {
    const occurrences = Object.entries(occurrencesHash);

    if (occurrences.length == 0) {
      return '-';
    }

    let mostOftenOccurrence = null;

    occurrences.forEach((occurrence) => {
      if (mostOftenOccurrence == null) {
        mostOftenOccurrence = occurrence;
        return;
      }

      const mostOftenOccurrenceCount = mostOftenOccurrence[1];
      const occurrenceCount = occurrence[1];

      if (occurrenceCount > mostOftenOccurrenceCount) {
        mostOftenOccurrence = occurrence;
      }
    });

    return mostOftenOccurrence[0];
  }
}
