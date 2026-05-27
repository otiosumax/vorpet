import PetPlaceholderRepository, {
  type Pet,
  type PetStats,
  type PetType,
} from "../services/petPlaceholderRepository";

const USER_ID = import.meta.env.VITE_USER_ID ?? "default";
const petRepository = new PetPlaceholderRepository(USER_ID);

export const useUserStore = {
  userId: USER_ID,
  pet: null as Pet | null,
  stats: null as PetStats | null,

  async loadPet() {
    this.pet = await petRepository.getOrCreatePet();
    this.stats = {
      mood: this.pet.mood,
      experience: this.pet.experience,
      level: this.pet.level,
    };

    return this.pet;
  },

  async customizePet(type: PetType) {
    this.pet = await petRepository.customizePet(type);

    return this.pet;
  },

  async loadStats() {
    this.stats = await petRepository.getStats();

    return this.stats;
  },

  async updateStats(stats: Partial<Pick<PetStats, "mood" | "experience">>) {
    this.pet = await petRepository.updateStats(stats);
    this.stats = {
      mood: this.pet.mood,
      experience: this.pet.experience,
      level: this.pet.level,
    };

    return this.stats;
  },
};
