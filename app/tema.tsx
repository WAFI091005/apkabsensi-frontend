import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useThemeApp } from './_layout'; // path sesuai lokasi

type Opt = { label: string; value: 'light' | 'dark' | 'system' };

const options: Opt[] = [
  { label: 'Terang',  value: 'light' },
  { label: 'Gelap',   value: 'dark' },
  { label: 'Ikuti Sistem', value: 'system' },
];

export default function Tema() {
  const { mode, setMode, isDark } = useThemeApp();

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#111' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {options.map((o) => {
        const selected = mode === o.value;
        return (
          <Pressable
            key={o.value}
            style={({ pressed }) => [
              styles.row,
              selected && styles.rowActive,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => setMode(o.value)}
          >
            <Text style={[styles.text, isDark && { color: '#EEE' }]}>{o.label}</Text>
            {selected && <Feather name="check" size={20} color="#6C63FF" />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 16,
    marginBottom: 16,
  },
  rowActive: { borderColor: '#6C63FF', backgroundColor: '#F4F7FC' },
  text: { fontSize: 16, color: '#333' },
});
