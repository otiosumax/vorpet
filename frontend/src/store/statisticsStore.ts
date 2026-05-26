export const useStatisticsStore = {
  statistics: {
    hunger: 0,
    mood: 0,
    energy: 0,
  },

  loadStatistics() {
    // In a real application, this would fetch data from an API or local storage
    this.statistics = {
      hunger: 67,
      mood: 69,
      energy: 42,
    };
  },

  getStatistics() {
    return this.statistics;
  },

  async saveStatistics() {
    // In a real application, this would save data to an API or local storage
    console.log("Statistics saved:", this.statistics);
  },

  async feed() {
    this.statistics.hunger = Math.max(0, this.statistics.hunger + 15);
  },
  async play() {
    this.statistics.mood = Math.min(100, this.statistics.mood + 15);
  },
  async rest() {
    this.statistics.energy = Math.min(100, this.statistics.energy + 15);
  },
};
