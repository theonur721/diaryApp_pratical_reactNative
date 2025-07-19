import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
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
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            <Text style={styles.mood}>Ruh Hali: {item.mood}</Text>
            {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
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
  emptyText: { fontSize: 18, color: "#999" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
