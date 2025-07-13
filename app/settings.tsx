// app/Pengaturan.tsx
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import i18n from '@/i18n';
import { useLanguage } from './_layout';

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

type MenuItem = {
  labelKey: string;
  href: string;
  groupKey: string;
  icon?: keyof typeof Feather.glyphMap;
  roles?: string[]; // Misalnya: ['guru', 'siswa']
};

export default function Pengaturan() {
  const router = useRouter();
  const { locale } = useLanguage();

  const [user, setUser] = useState<{ name: string; role: string; photo: string | null }>({
    name: '',
    role: '',
    photo: null,
  });

  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadingUser(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const res = await fetch('http://192.168.233.77:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const me = await res.json();
          setUser({
            name: me.name ?? i18n.t('user_placeholder'),
            role: me.role ?? i18n.t('unknown'),
            photo: me.photo_url ?? null,
          });
        } else {
            Alert.alert(i18n.t('error'), i18n.t('session_expired_message'), [
                { text: i18n.t('ok'), onPress: () => router.replace('/login') }
            ]);
        }
      } catch (e) {
        console.error('Profil error di Pengaturan:', e);
        Alert.alert(i18n.t('error'), i18n.t('koneksi_gagal'));
      } finally {
        setLoadingUser(false);
      }
    })();
  }, [locale]);

  const allMenuItems: MenuItem[] = [
    { labelKey: 'profile', href: '/edit-profil', groupKey: 'account_security', icon: 'user' },
    { labelKey: 'password', href: '/ubah-sandi', groupKey: 'account_security', icon: 'lock' },

    { labelKey: 'manage_classes', href: '/kelola-kelas', groupKey: 'data_management', icon: 'home', roles: ['guru'] },
    { labelKey: 'student_roster', href: '/roster-siswa', groupKey: 'data_management', icon: 'users', roles: ['guru'] },
    { labelKey: 'attendance_report', href: '/laporan', groupKey: 'data_management', icon: 'bar-chart-2', roles: ['guru'] },

    { labelKey: 'theme_display', href: '/tema', groupKey: 'app_preferences', icon: 'sun' },
    { labelKey: 'language', href: '/bahasa', groupKey: 'app_preferences', icon: 'globe' },
    { labelKey: 'data_sync', href: '/sync', groupKey: 'app_preferences', icon: 'refresh-cw' },

    { labelKey: 'about_app', href: '/about', groupKey: 'info_help', icon: 'info' },
    { labelKey: 'privacy_policy', href: '/privacy', groupKey: 'info_help', icon: 'shield' },
    { labelKey: 'help_faq', href: '/help', groupKey: 'info_help', icon: 'help-circle' },
  ];

  const filteredMenu = useMemo(() => {
    if (loadingUser || !user || !user.role) {
      return [];
    }
    return allMenuItems.filter(item => {
      if (!item.roles) {
        return true;
      }
      return item.roles.includes(user.role);
    });
  }, [allMenuItems, user, loadingUser]);

  const grouped = useMemo(
    () =>
      filteredMenu.reduce<Record<string, MenuItem[]>>((acc, cur) => {
        const translatedGroup = i18n.t(cur.groupKey);
        (acc[translatedGroup] = acc[translatedGroup] || []).push(cur);
        return acc;
      }, {}),
    [filteredMenu, locale],
  );

  const Item = ({ labelKey, href, icon }: MenuItem) => (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
      onPress={() => router.push(href as any)}
    >
      {icon && <Feather name={icon} size={20} color={Colors.accentColor} style={styles.menuItemIcon} />}
      <Text style={styles.menuItemText}>{i18n.t(labelKey)}</Text>
      <Feather name="chevron-right" size={20} color={Colors.textMedium} />
    </Pressable>
  );

  const logout = () =>
    Alert.alert(
      i18n.t('confirm_logout_title'),
      i18n.t('confirm_logout_message'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('logout_button'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            router.replace('/login');
          },
        },
      ],
    );

  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accentColor} />
        <Text style={styles.loadingTextPengaturan}>{i18n.t('loading_profile_data') || 'Memuat data pengguna...'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: i18n.t('settings') }} />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <Pressable style={styles.profileCard} onPress={() => router.push('/edit-profil' as any)}>
        {user.photo ? (
          <Image source={{ uri: user.photo }} style={styles.avatar} />
        ) : (
          <LinearGradient
            colors={Colors.avatarGradient1}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="user" size={40} color={Colors.cardBackground} />
          </LinearGradient>
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name || i18n.t('loading')}</Text>
          <Text style={styles.profileRole}>{user.role ? user.role.toUpperCase() : i18n.t('unknown_role')}</Text>
        </View>
        <Feather name="edit-2" size={20} color={Colors.accentColor} style={styles.editIcon} />
      </Pressable>

      {Object.entries(grouped).map(([grp, items]) => (
        <View key={grp} style={styles.menuGroup}>
          <Text style={styles.groupTitle}>{grp}</Text>
          <View style={styles.menuItemsContainer}>
            {items.map((m) => (
              <Item key={m.href} {...m} />
            ))}
          </View>
        </View>
      ))}

      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
        onPress={logout}
      >
        <Feather name="log-out" size={20} color={Colors.dangerColor} style={styles.logoutButtonIcon} />
        <Text style={styles.logoutButtonText}>{i18n.t('logout')}</Text>
      </Pressable>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingTextPengaturan: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textMedium,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    padding: 18,
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  placeholderAvatar: {
    backgroundColor: Colors.primaryGreen,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 19, fontWeight: '700', color: Colors.textDark, marginBottom: 4 },
  profileRole: { fontSize: 14, color: Colors.textMedium },
  editIcon: { alignSelf: 'center', marginTop: 0 },

  menuGroup: { marginBottom: 20 },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryGreen,
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItemsContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  menuItemPressed: { backgroundColor: '#F8F8F8' },
  menuItemIcon: { marginRight: 15 },
  menuItemText: { flex: 1, fontSize: 16, color: Colors.textDark, fontWeight: '500' },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    paddingVertical: 18,
    marginTop: 'auto',
    marginBottom: 20,
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
    borderWidth: 1,
    borderColor: '#FFDEDE',
  },
  logoutButtonPressed: { backgroundColor: '#FFE5E5' },
  logoutButtonIcon: { marginRight: 10 },
  logoutButtonText: { color: Colors.dangerColor, fontSize: 17, fontWeight: '700' },
});