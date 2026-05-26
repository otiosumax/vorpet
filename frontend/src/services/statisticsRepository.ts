export default class StatisticsRepository {
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getStatistics() {
    const response = await fetch("/api/statistics");
    if (!response.ok) throw new Error("Failed to fetch statistics");
    return await response.json();
  }

  async feed() {
    const response = await fetch("/api/statistics/feed", { method: "POST" });
    if (!response.ok) throw new Error("Failed to feed the pet");
    return await response.json();
  }

  async play() {
    const response = await fetch("/api/statistics/play", { method: "POST" });
    if (!response.ok) throw new Error("Failed to play with the pet");
    return await response.json();
  }

  async rest() {
    const response = await fetch("/api/statistics/rest", { method: "POST" });
    if (!response.ok) throw new Error("Failed to let the pet rest");
    return await response.json();
  }
}
