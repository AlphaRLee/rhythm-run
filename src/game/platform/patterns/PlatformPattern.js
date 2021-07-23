export default class PlatformPattern {
  constructor(game) {
    this.game = game;
  }

  /**
   * A score between 0-1 indicating how well the notesData fits the pattern
   * @param {*} notesData
   */
  fitScore(barData) {}

  build(barData) {}
}
