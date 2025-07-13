// app/about.tsx
import { Feather, Ionicons } from '@expo/vector-icons'; // Menambahkan Ionicons
import { Stack } from 'expo-router'; // Import Stack
import React from 'react';
import {
  Linking, // Untuk membuka tautan eksternal
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import i18n from '@/i18n';
import { useLanguage } from './_layout'; // Sesuaikan path jika perlu

// Definisi warna yang konsisten dengan tema hijau Anda
const Colors = {
  primaryGreen: '#4CAF50',
  primaryGreenLight: '#8BC34A', // Tidak digunakan langsung di sini, tapi untuk konsistensi palet
  background: '#F0F4F8',
  cardBackground: '#FFFFFF',
  textDark: '#263238',
  textMedium: '#546E7A',
  textLight: '#ECEFF1',
  accentColor: '#4CAF50', // Tetap hijau untuk ikon/aksen
  borderColor: '#EFEFEF',
  shadowColor: '#000',
};

const APP_VERSION = '1.0.0'; // Ganti dengan versi aplikasi Anda yang sebenarnya
const DEVELOPER_NAME = 'Tim Absensi Hebat'; // Ganti dengan nama pengembang
const DEVELOPER_EMAIL = 'support@example.com'; // Ganti dengan email kontak
const WEBSITE_URL = 'https://www.google.com'; // Ganti dengan URL website Anda (jika ada)

export default function AboutScreen() {
  const { locale } = useLanguage(); // Untuk re-render saat bahasa berubah

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: i18n.t('about_app') }} />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.appIconContainer}>
        {/* Anda bisa mengganti ini dengan logo aplikasi Anda */}
        <Ionicons name="school-outline" size={80} color={Colors.primaryGreen} />
      </View>
      
      <Text style={styles.appName}>Absensi Hebat</Text>
      <Text style={styles.appDescription}>{i18n.t('app_description_short')}</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{i18n.t('app_version')}:</Text>
          <Text style={styles.infoValue}>{APP_VERSION}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{i18n.t('developed_by')}:</Text>
          <Text style={styles.infoValue}>{DEVELOPER_NAME}</Text>
        </View>
      </View>

      <View style={styles.linksCard}>
        <TouchableOpacity style={styles.linkItem} onPress={() => handleOpenLink(`mailto:${DEVELOPER_EMAIL}`)}>
          <Feather name="mail" size={20} color={Colors.accentColor} style={styles.linkIcon} />
          <Text style={styles.linkText}>{i18n.t('contact_us')}</Text>
          <Feather name="chevron-right" size={20} color={Colors.textMedium} />
        </TouchableOpacity>
        {WEBSITE_URL && (
          <TouchableOpacity style={styles.linkItem} onPress={() => handleOpenLink(WEBSITE_URL)}>
            <Feather name="globe" size={20} color={Colors.accentColor} style={styles.linkIcon} />
            <Text style={styles.linkText}>{i18n.t('visit_website')}</Text>
            <Feather name="chevron-right" size={20} color={Colors.textMedium} />
          </TouchableOpacity>
        )}
        {/* Contoh link ke Privacy Policy atau Terms of Service, jika ada rute di aplikasi Anda */}
        {/* <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/privacy' as any)}>
          <Feather name="shield" size={20} color={Colors.accentColor} style={styles.linkIcon} />
          <Text style={styles.linkText}>{i18n.t('privacy_policy_link')}</Text>
          <Feather name="chevron-right" size={20} color={Colors.textMedium} />
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/terms' as any)}>
          <Feather name="file-text" size={20} color={Colors.accentColor} style={styles.linkIcon} />
          <Text style={styles.linkText}>{i18n.t('terms_of_service')}</Text>
          <Feather name="chevron-right" size={20} color={Colors.textMedium} />
        </TouchableOpacity> */}
      </View>

      <View style={{ height: 30 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  appIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 15,
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textMedium,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginVertical: 5,
  },
  linksCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    overflow: 'hidden', // Penting untuk borderRadius pada child
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  linkIcon: {
    marginRight: 15,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '500',
  },
});