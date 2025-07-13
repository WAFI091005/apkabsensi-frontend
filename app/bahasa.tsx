// app/bahasa.tsx
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from './_layout';

const languages = [
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'en', label: 'English' },
];

export default function Bahasa() {
  const { locale, setLocale } = useLanguage();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: i18n.t('language') }} />
      {languages.map(l => {
        const active = l.code === locale;
        return (
          <Pressable
            key={l.code}
            onPress={() => setLocale(l.code)}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{l.label}</Text>
            {active && <Feather name="check" size={20} color="#6C63FF" />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  itemActive: { backgroundColor: '#EEF1FF', borderColor: '#6C63FF' },
  text: { fontSize: 16 },
  textActive: { color: '#6C63FF', fontWeight: '700' },
});
