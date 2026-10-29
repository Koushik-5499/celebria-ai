import { StorageDataV1 } from '../types/index'
import { getSampleInitialState } from '../utils/sampleData'

export interface IStorageService {
  loadData(): Promise<StorageDataV1>;
  saveData(data: StorageDataV1): Promise<void>;
  exportJSON(data: StorageDataV1): string;
  importJSON(jsonString: string): StorageDataV1 | null;
  resetToSampleData(): Promise<StorageDataV1>;
  clearAll(): Promise<StorageDataV1>;
}

const STORAGE_KEY = 'celebria_ai_planner_v1';

class LocalFirstStorageService implements IStorageService {
  async loadData(): Promise<StorageDataV1> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = getSampleInitialState();
        await this.saveData(initial);
        return initial;
      }

      const parsed = JSON.parse(raw);
      // Validate schema version
      if (parsed && parsed.version === 1 && Array.isArray(parsed.events)) {
        return {
          version: 1,
          events: parsed.events || [],
          plans: parsed.plans || {},
          expenses: parsed.expenses || [],
          tasks: parsed.tasks || [],
          vendors: parsed.vendors || [],
        };
      } else {
        console.warn('[Celebria Storage] Storage format outdated or invalid, re-initializing.');
        const sample = getSampleInitialState();
        await this.saveData(sample);
        return sample;
      }
    } catch (error) {
      console.error('[Celebria Storage] Failed to load data from localStorage:', error);
      const fallback = getSampleInitialState();
      return fallback;
    }
  }

  async saveData(data: StorageDataV1): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[Celebria Storage] Failed to save data to localStorage:', error);
    }
  }

  exportJSON(data: StorageDataV1): string {
    return JSON.stringify(data, null, 2);
  }

  importJSON(jsonString: string): StorageDataV1 | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.events)) {
        const validated: StorageDataV1 = {
          version: 1,
          events: parsed.events,
          plans: parsed.plans || {},
          expenses: parsed.expenses || [],
          tasks: parsed.tasks || [],
          vendors: parsed.vendors || [],
        };
        this.saveData(validated);
        return validated;
      }
      return null;
    } catch (err) {
      console.error('[Celebria Storage] Import JSON parse error:', err);
      return null;
    }
  }

  async resetToSampleData(): Promise<StorageDataV1> {
    const sample = getSampleInitialState();
    await this.saveData(sample);
    return sample;
  }

  async clearAll(): Promise<StorageDataV1> {
    const empty: StorageDataV1 = {
      version: 1,
      events: [],
      plans: {},
      expenses: [],
      tasks: [],
      vendors: [],
    };
    await this.saveData(empty);
    return empty;
  }
}

export const storageService: IStorageService = new LocalFirstStorageService();
