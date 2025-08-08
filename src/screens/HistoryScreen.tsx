import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { DiaryEntry } from "../types";
import { Storage } from "../storage/storage";

export default function HistoryScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    const data = await Storage.getEntries();
    setEntries(
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleDelete = async (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
    await Storage.saveEntries(newEntries);
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz kayıt yok.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.entry}>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            <Text style={styles.mood}>Ruh Hali: {item.mood}</Text>
            {item.note ? <Text style={styles.note}>{item.note}</Text> : null}

            <TouchableOpacity
              onPress={() => handleDelete(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  entry: {
    backgroundColor: "#f3f3f3",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  date: { fontWeight: "bold", marginBottom: 4 },
  mood: { fontSize: 18, marginBottom: 4 },
  note: { fontSize: 16, color: "#555" },
  deleteButton: {
    marginTop: 8,
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: { fontSize: 18, color: "#999" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
