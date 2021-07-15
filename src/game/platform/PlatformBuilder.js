import RestPattern from "./patterns/RestPattern";
import RisingPattern from "./patterns/RisingPattern";

export default class PlatformBuilder {
  constructor(game) {
    this.game = game;
    this.platformPatterns = [new RestPattern(game), new RisingPattern(game)];
  }

  /**
   * When a "bar" of music is read, build a platform pattern
   * @param {Array} notesData
   */
  onReadBar(notesData) {
    const pattern = this.selectPattern(notesData);
    pattern.build(notesData);
  }

  /**
   * Calculate the fitScore of each pattern and select a pattern that matches
   * @param {Array} notesData
   * @returns {PlatformPattern} Best fitting pattern
   */
  selectPattern(notesData) {
    const patternScores = this.platformPatterns.map((pattern) => ({ pattern, score: pattern.fitScore(notesData) }));
    // Filter by a minimum threshold
    const minScoreThreshold = 0.5;
    let filteredPatternScores = patternScores.filter((patternData) => patternData.score >= minScoreThreshold);
    // Sort by descending scores
    filteredPatternScores.sort((patternData1, patternData2) => patternData1.score - patternData2.score);

    const topPatternThreshold = Math.min(filteredPatternScores.length, 5);
    const randIndex = Math.floor(Math.random() * topPatternThreshold);
    return filteredPatternScores[randIndex].pattern;
  }
}
