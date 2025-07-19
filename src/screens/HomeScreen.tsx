import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import EmojiButton from "../components/EmojiButton";
import { DiaryEntry } from "../types";
import { Storage } from "../storage/storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

const moods = ["😊", "😢", "😡", "😴", "😕"];

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const saveEntry = async () => {
    if (!selectedMood) {
      Alert.alert("Uyarı", "Lütfen bir ruh hali seçin.");
      return;
    }

    const newEntry: DiaryEntry = {
      mood: selectedMood,
      note,
      date: new Date().toISOString(),
    };

    await Storage.addEntry(newEntry);
    setSelectedMood(null);
    setNote("");
    Alert.alert("Başarılı", "Günlük kaydedildi!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bugün nasılsın?</Text>

      <View style={styles.emojiContainer}>
        {moods.map((mood) => (
          <EmojiButton
            key={mood}
            emoji={mood}
            selected={selectedMood === mood}
            onPress={() => setSelectedMood(mood)}
          />
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Bugün neler hissettin?"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={saveEntry}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={styles.linkText}>Geçmişi Gör</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  linkText: {
    textAlign: "center",
    color: "#4caf50",
    fontSize: 16,
  },
});
