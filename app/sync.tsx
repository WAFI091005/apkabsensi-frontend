// app/sync.tsx
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    StatusBar, // <<< Sudah ditambahkan di sini
    StyleSheet,
    Text,
    TouchableOpacity,
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
  buttonTextLight: '#FFFFFF',
};

export default function SyncScreen() {
  const { locale } = useLanguage();
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadLastSyncTimestamp();
  }, []);

  const loadLastSyncTimestamp = async () => {
    try {
      const timestamp = await AsyncStorage.getItem('last_sync_timestamp');
      if (timestamp) {
        setLastSync(timestamp);
      }
    } catch (e) {
      console.error('Failed to load last sync timestamp:', e);
    }
  };

  const saveLastSyncTimestamp = async () => {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem('last_sync_timestamp', now);
      setLastSync(now);
    } catch (e) {
      console.error('Failed to save last sync timestamp:', e);
    }
  };

  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    Alert.alert(i18n.t('info'), i18n.t('syncing'));

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(i18n.t('error'), i18n.t('empty_token_redirect_login'));
        // You might want to redirect to login here if token is crucial for sync
        return; 
      }

      // --- SIMULASI API SYNC REQUEST ---
      // Ganti dengan panggilan API Anda yang sebenarnya, misalnya:
      // const response = await fetch('http://192.168.233.77:8000/api/sync-data', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   // body: JSON.stringify({ /* data yang perlu disinkronkan */ })
      // });
      // const result = await response.json();
      // if (!response.ok) {
      //   throw new Error(result.message || 'Sync failed');
      // }
      // --- AKHIR SIMULASI ---

      // Simulasikan delay API call
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      // Jika sync API Anda mengembalikan data baru, Anda perlu memperbarui state aplikasi di sini
      // Contoh: dispatch({ type: 'UPDATE_DATA', payload: result.data });

      saveLastSyncTimestamp();
      Alert.alert(i18n.t('info'), i18n.t('sync_success'));
    } catch (error: any) {
      console.error('Sync failed:', error);
      Alert.alert(i18n.t('error'), error.message || i18n.t('sync_failed'));
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSyncTime = (timestamp: string | null) => {
    if (!timestamp) return i18n.t('never');
    const date = new Date(timestamp);
    return date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: i18n.t('data_sync') }} />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.card}>
        <Feather name="refresh-cw" size={48} color={Colors.primaryGreen} style={styles.icon} />
        <Text style={styles.title}>{i18n.t('data_sync')}</Text>
        <Text style={styles.description}>{i18n.t('sync_description')}</Text>
        
        <Text style={styles.lastSyncText}>
          {i18n.t('last_sync')} {formatLastSyncTime(lastSync)}
        </Text>

        <TouchableOpacity
          style={styles.syncButton}
          onPress={handleSync}
          disabled={isSyncing}
          activeOpacity={0.7}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color={Colors.buttonTextLight} />
          ) : (
            <>
              <Feather name="refresh-ccw" size={20} color={Colors.buttonTextLight} style={styles.buttonIcon} />
              <Text style={styles.syncButtonText}>{i18n.t('sync_now')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  lastSyncText: {
    fontSize: 14,
    color: Colors.textMedium,
    marginBottom: 30,
  },
  syncButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primaryGreen,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  syncButtonText: {
    color: Colors.buttonTextLight,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
});