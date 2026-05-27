export type PetType = "cat" | "dog";

export type Pet = {
  id: number;
  userId: string;
  type: PetType;
  color: string;
  accessories: unknown[];
  mood: string;
  level: number;
  experience: number;
  createdAt: string;
  updatedAt: string;
};

export type PetStats = {
  mood: string;
  experience: number;
  level: number;
};

const STORAGE_KEY_PREFIX = "vorpet.pet.";

export default class PetPlaceholderRepository {
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getOrCreatePet() {
    return this.getPet();
  }

  async customizePet(type: PetType) {
    const pet = this.getPet();
    const updatedPet = this.savePet({
      ...pet,
      type,
      updatedAt: new Date().toISOString(),
    });

    return updatedPet;
  }

  async getStats() {
    const pet = this.getPet();

    return {
      mood: pet.mood,
      experience: pet.experience,
      level: pet.level,
    };
  }

  async updateStats(stats: Partial<Pick<PetStats, "mood" | "experience">>) {
    const pet = this.getPet();
    const nextExperience = pet.experience + (stats.experience ?? 0);
    const nextLevel = Math.max(1, Math.floor(nextExperience / 100) + 1);

    return this.savePet({
      ...pet,
      mood: stats.mood ?? pet.mood,
      experience: nextExperience,
      level: nextLevel,
      updatedAt: new Date().toISOString(),
    });
  }

  private getPet() {
    const savedPet = window.localStorage.getItem(this.storageKey);

    if (savedPet) {
      return JSON.parse(savedPet) as Pet;
    }

    return this.savePet(this.createPet());
  }

  private savePet(pet: Pet) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(pet));

    return pet;
  }

  private createPet(): Pet {
    const now = new Date().toISOString();

    return {
      id: 1,
      userId: this.userId,
      type: "cat",
      color: "#FFFFFF",
      accessories: [],
      mood: "happy",
      level: 1,
      experience: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  private get storageKey() {
    return `${STORAGE_KEY_PREFIX}${this.userId}`;
  }
}
