// app/(tabs)/profile.tsx
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient'; // Pastikan ini diimpor
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import i18n from '@/i18n';
import { useLanguage } from '../_layout';

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
  white: '#FFFFFF',

  avatarGradient1: ['#66BB6A', '#4CAF50'] as const, // Gradien hijau untuk header dan avatar placeholder
  avatarGradient2: ['#8BC34A', '#689F38'] as const,
};

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { locale } = useLanguage();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      const res = await axios.get('http://192.168.233.77:8000/api/me', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      setUser({
        ...res.data,
        name: res.data.name ?? i18n.t('user_placeholder'),
        role: res.data.role ?? i18n.t('unknown'),
        email: res.data.email ?? i18n.t('not_available'),
        kelas: res.data.role === 'siswa' && res.data.siswa ? res.data.siswa.kelas : i18n.t('not_available'),
        photo_url: res.data.photo_url ?? null,
      });

    } catch (error) {
      console.error('❌ Gagal ambil data user:', error);
      Alert.alert(
        i18n.t('session_expired') || "Sesi Habis",
        i18n.t('session_expired_message') || "Sesi Anda telah berakhir atau terjadi kesalahan. Silakan masuk kembali.",
        [{ text: i18n.t('ok') || "OK", onPress: () => router.replace('/login') }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [locale]);

  const handleLogout = async () => {
    Alert.alert(
      i18n.t('confirm_logout_title'),
      i18n.t('confirm_logout_message'),
      [
        { text: i18n.t('cancel'), style: "cancel" },
        {
          text: i18n.t('logout_button'),
          style: "destructive",
          onPress: async () => {
            const token = await AsyncStorage.getItem('token');
            try {
              await axios.post('http://192.168.233.77:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
              });
            } catch (error) {
              console.warn('⚠️ Logout gagal di backend, hapus token lokal saja:', error);
            } finally {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accentColor} />
        <Text style={styles.loadingText}>{i18n.t('loading_profile_data') || 'Memuat data profil Anda...'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user && (
        <>
          {/* Header section with user avatar, name, and role */}
          <LinearGradient colors={Colors.avatarGradient1} style={styles.header}>
            {user.photo_url ? (
              <Image source={{ uri: user.photo_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={40} color={Colors.cardBackground} />
              </View>
            )}
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role ? user.role.toUpperCase() : i18n.t('unknown_role')}</Text>
          </LinearGradient>

          {/* Information Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Feather name="mail" size={20} color={Colors.accentColor} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.label}>{i18n.t('email') || 'Email'}</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
            </View>

            {user.role === 'siswa' && (
              <>
                <View style={styles.infoSeparator} />
                <View style={styles.infoRow}>
                  <Feather name="user" size={20} color={Colors.accentColor} style={styles.infoIcon} />
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>{i18n.t('nama_siswa') || 'Nama Siswa'}</Text>
                    <Text style={styles.value}>{user.name}</Text>
                  </View>
                </View>

                <View style={styles.infoSeparator} />
                <View style={styles.infoRow}>
                  <Feather name="award" size={20} color={Colors.accentColor} style={styles.infoIcon} />
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>{i18n.t('kelas_siswa') || 'Kelas'}</Text>
                    <Text style={styles.value}>{user.kelas}</Text>
                  </View>
                </View>
              </>
            )}

            {user.role === 'guru' && (
              <>
                <View style={styles.infoSeparator} />
                <View style={styles.infoRow}>
                  <Feather name="briefcase" size={20} color={Colors.accentColor} style={styles.infoIcon} />
                  <View style={styles.infoContent}>
                    <Text style={styles.label}>{i18n.t('position') || 'Jabatan'}</Text>
                    <Text style={styles.value}>{user.position || i18n.t('teacher') || 'Guru'}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Tombol Pengaturan (Settings Button) */}
          <Pressable
            style={({ pressed }) => [styles.settingsButton, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/settings' as any)}
          >
            <Feather name="settings" size={20} color={Colors.textDark} style={styles.settingsButtonIcon} />
            <Text style={styles.settingsButtonText}>{i18n.t('settings')}</Text>
            <Feather name="chevron-right" size={20} color={Colors.textMedium} />
          </Pressable>

          {/* Tombol Keluar Akun (Logout Button) */}
          <Pressable
            style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={20} color={Colors.dangerColor} style={styles.logoutIcon} />
            <Text style={styles.logoutText}>{i18n.t('sign_out_of_account') || i18n.t('logout')}</Text>
          </Pressable>
        </>
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingVertical: 0,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 25,
    marginTop: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: Colors.cardBackground,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryGreenLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  avatarText: {
    fontSize: 32,
    color: Colors.primaryGreen,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 5,
    textAlign: 'center',
  },
  role: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: Colors.textMedium,
    marginBottom: 2,
  },
  value: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textDark,
  },
  infoSeparator: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginVertical: 10,
    marginHorizontal: -20,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  settingsButtonIcon: {
    marginRight: 15,
  },
  settingsButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: Colors.cardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.dangerColor,
    ...Platform.select({
      ios: {
        shadowColor: Colors.dangerColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logoutButtonPressed: {
    backgroundColor: '#FFE5E5',
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: Colors.dangerColor,
    fontWeight: '700',
    fontSize: 17,
  },
});