import AsyncStorage from "@react-native-async-storage/async-storage";
import { DiaryEntry } from "../types";

const STORAGE_KEY = "diary_entries";

export const Storage = {
  async getEntries(): Promise<DiaryEntry[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (!json) return [];
      const parsed: unknown = JSON.parse(json);

      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is DiaryEntry => {
          return (
            typeof item === "object" &&
            typeof item.mood === "string" &&
            typeof item.note === "string" &&
            typeof item.date === "string"
          );
        });
      }

      return [];
    } catch (e) {
      console.error("Veri okunurken hata:", e);
      return [];
    }
  },

  async addEntry(entry: DiaryEntry): Promise<void> {
    try {
      const entries = await this.getEntries();
      entries.push(entry);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Veri eklenirken hata:", e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Veriler silinirken hata:", e);
    }
  },
};
