import StatisticsRepository from "./statisticsRepository";

export default class StatisticsPlaceholderRepository extends StatisticsRepository {
  constructor(userId: string) {
    super(userId);
  }

  async getStatistics() {
    return {
      hunger: Math.floor(Math.random() * 100),
      mood: Math.floor(Math.random() * 100),
      energy: Math.floor(Math.random() * 100),
    };
  }

  async feed() {
    return this.getStatistics();
  }

  async play() {
    return this.getStatistics();
  }

  async rest() {
    return this.getStatistics();
  }
}
