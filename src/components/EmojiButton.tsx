import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  emoji: string;
  selected: boolean;
  onPress: () => void;
};

export default function EmojiButton({ emoji, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, selected && styles.selected]}
    >
      <Text style={styles.text}>{emoji}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  selected: {
    backgroundColor: "#a0d2eb",
  },
  text: {
    fontSize: 24,
  },
});
