import PetPlaceholderRepository, {
  type PetStats,
} from "../services/petPlaceholderRepository";

const USER_ID = import.meta.env.VITE_USER_ID ?? "default";
const petRepository = new PetPlaceholderRepository(USER_ID);

export const useStatisticsStore = {
  statistics: {
    mood: "happy",
    experience: 0,
    level: 1,
  },

  async loadStatistics() {
    await petRepository.getOrCreatePet();
    this.statistics = await petRepository.getStats();

    return this.statistics;
  },

  getStatistics() {
    return this.statistics;
  },

  async updateStatistics(stats: Partial<Pick<PetStats, "mood" | "experience">>) {
    const pet = await petRepository.updateStats(stats);
    this.statistics = {
      mood: pet.mood,
      experience: pet.experience,
      level: pet.level,
    };

    return this.statistics;
  },

  async feed() {
    return this.updateStatistics({ mood: "happy", experience: 5 });
  },

  async play() {
    return this.updateStatistics({ mood: "excited", experience: 10 });
  },

  async rest() {
    return this.updateStatistics({ mood: "tired", experience: 3 });
  },
};
