// app/privacy.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import i18n from '@/i18n'; // Pastikan path ini benar
import { useLanguage } from './_layout'; // Untuk konsistensi bahasa

// --- Colors definition (idealnya ini di file terpisah dan diimpor) ---
const Colors = {
  primaryGreen: '#4CAF50',
  primaryGreenLight: '#8BC34A',
  background: '#F0F4F8',
  cardBackground: '#FFFFFF',
  textDark: '#263238',
  textMedium: '#546E7A',
  textLight: '#ECEFF1',
  accentColor: '#4CAF50',
  dangerColor: '#E74C3C',
  borderColor: '#EFEFEF',
  shadowColor: '#000',

  avatarGradient1: ['#66BB6A', '#4CAF50'] as const,
  avatarGradient2: ['#8BC34A', '#689F38'] as const,
};
// ------------------------------------------------------------------

export default function PrivacyPolicy() {
  const { locale } = useLanguage(); // Gunakan locale jika ada teks yang perlu diperbarui secara dinamis

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: i18n.t('privacy_policy'), // Menggunakan terjemahan dari i18n
          headerStyle: {
            backgroundColor: Colors.background, // Latar belakang header
          },
          headerTintColor: Colors.textDark, // Warna teks header
          headerShadowVisible: false, // Menghilangkan shadow di bawah header jika tidak diinginkan
        }}
      />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.card}>
        <Text style={styles.title}>{i18n.t('privacy_policy_title_long') || "Kebijakan Privasi Aplikasi Ini"}</Text>
        <Text style={styles.lastUpdated}>{i18n.t('last_updated')} Januari 1, 2025</Text>

        <Text style={styles.sectionTitle}>{i18n.t('introduction')}</Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_intro_text_1')}
        </Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_intro_text_2')}
        </Text>

        <Text style={styles.sectionTitle}>{i18n.t('data_we_collect')}</Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_data_collection_1')}
        </Text>
        <Text style={styles.listItem}>
          • {i18n.t('personal_info')}: {i18n.t('personal_info_desc')}
        </Text>
        <Text style={styles.listItem}>
          • {i18n.t('usage_data')}: {i18n.t('usage_data_desc')}
        </Text>

        <Text style={styles.sectionTitle}>{i18n.t('how_we_use_data')}</Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_data_usage_1')}
        </Text>
        <Text style={styles.listItem}>
          • {i18n.t('provide_services')}: {i18n.t('provide_services_desc')}
        </Text>
        <Text style={styles.listItem}>
          • {i18n.t('improve_app')}: {i18n.t('improve_app_desc')}
        </Text>
        <Text style={styles.listItem}>
          • {i18n.t('communication')}: {i18n.t('communication_desc')}
        </Text>

        <Text style={styles.sectionTitle}>{i18n.t('data_security')}</Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_data_security_1')}
        </Text>

        <Text style={styles.sectionTitle}>{i18n.t('third_party_services')}</Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_third_party_1')}
        </Text>

        <Text style={styles.sectionTitle}>{i18n.t('your_rights')}</Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_your_rights_1')}
        </Text>

        <Text style={styles.sectionTitle}>{i18n.t('changes_to_policy')}</Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_changes_1')}
        </Text>

        <Text style={styles.sectionTitle}>{i18n.t('contact_us')}</Text>
        <Text style={styles.paragraph}>
          {i18n.t('privacy_contact_1')}
          {'\n'}
          Email: support@aplikasianda.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryGreen,
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 22,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
    marginLeft: 15,
    marginBottom: 5,
  },
});