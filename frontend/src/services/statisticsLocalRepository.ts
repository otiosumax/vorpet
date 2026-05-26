export default class StatisticsLocalRepository {
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getStatistics() {
    return {
      hunger: 67,
      mood: 69,
      energy: 42,
    };
  }
}