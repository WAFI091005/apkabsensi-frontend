// app/edit-profil.tsx
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// --- Colors definition (for consistency, ideally this would be in a shared file) ---
const Colors = {
  primaryGreen: '#4CAF50',
  primaryGreenLight: '#8BC34A',
  background: '#F0F4F8',
  cardBackground: '#FFFFFF',
  textDark: '#263238',
  textMedium: '#546E7A',
  textLight: '#ECEFF1',
  accentColor: '#4CAF50', // Changed to primaryGreen
  dangerColor: '#E74C3C',
  borderColor: '#EFEFEF',
  shadowColor: '#000',

  avatarGradient1: ['#66BB6A', '#4CAF50'] as const,
  avatarGradient2: ['#8BC34A', '#689F38'] as const,
};
// ----------------------------------------------------------------------------------

export default function EditProfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ------- form state -------
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null); // uri lokal yg dipilih
  const [photoRemote, setPhotoRemote] = useState<string | null>(null); // uri foto di server

  // ------- prefilling profile -------
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return router.replace('/login');

      try {
        const res = await fetch('http://192.168.233.77:8000/api/me', {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (res.ok) {
          const me = await res.json();
          setName(me.name ?? '');
          setPhotoRemote(me.photo_url ?? null);
        } else {
          Alert.alert('Error', 'Gagal memuat profil');
        }
      } catch {
        Alert.alert('Error', 'Koneksi gagal');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------- image picker -------
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Izin ditolak', 'Akses galeri diperlukan');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // ------- save profile -------
  const save = async () => {
    if (!name.trim()) return Alert.alert('Nama wajib diisi');

    setSaving(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) return router.replace('/login');

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('_method', 'PATCH'); // ← triknya, agar Laravel anggap PATCH

      if (photo) {
        const filename = photo.split('/').pop()!;
        const ext = filename.split('.').pop()!;
        form.append('photo', {
          uri: photo,
          name: filename,
          type: `image/${ext}`,
        } as any);
      }

      const res = await fetch('http://192.168.233.77:8000/api/me', {
        method: 'POST', // tetap POST
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json', // minta respon JSON
        },
        body: form,
      });

      const text = await res.text();
      if (res.ok) {
        const updated = JSON.parse(text);
        setName(updated.name);
        setPhotoRemote(updated.photo_url ?? null);
        Alert.alert('Berhasil', 'Profil diperbarui', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', text || 'Gagal menyimpan');
      }
    } catch {
      Alert.alert('Error', 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accentColor} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* FOTO */}
        <Pressable style={styles.avatarContainer} onPress={pickImage}>
          <View style={styles.avatarRing}>
            {photo || photoRemote ? (
              <Image source={{ uri: photo || photoRemote! }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={60} color={Colors.cardBackground} /> {/* Icon 'user' lebih besar */}
              </View>
            )}
          </View>
          <View style={styles.editBadge}>
            <Feather name="camera" size={18} color={Colors.cardBackground} />
          </View>
        </Pressable>

        {/* NAMA */}
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama"
          placeholderTextColor={Colors.textMedium}
          value={name}
          onChangeText={setName}
        />

        {/* TOMBOL SIMPAN */}
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.7 }]}
          onPress={save}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={Colors.cardBackground} />
          ) : (
            <>
              <Feather name="save" size={18} color={Colors.cardBackground} style={{ marginRight: 8 }} />
              <Text style={styles.saveText}>Simpan</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },

  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative', // Needed for absolute positioning of editBadge
    alignItems: 'center', // Center content horizontally
  },
  avatarRing: {
    width: 130, // Slightly larger than avatar
    height: 130,
    borderRadius: 65, // Half of width/height for perfect circle
    borderWidth: 5, // Green border thickness
    borderColor: Colors.primaryGreen, // Green border color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Space between ring and "Ganti" text
    ...Platform.select({ // Add shadow for depth
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
  },
  avatar: {
    width: 120, // Smaller than ring
    height: 120,
    borderRadius: 60, // Half of width/height for perfect circle
    borderWidth: 2,
    borderColor: Colors.cardBackground, // White border inside the green ring
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryGreenLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5, // Posisi di dalam area foto
    right: 5, // Posisi di dalam area foto
    width: 34, // Ukuran badge yang proporsional
    height: 34,
    borderRadius: 17, // Setengah dari width/height untuk lingkaran sempurna
    backgroundColor: Colors.primaryGreen, // Latar belakang hijau solid
    borderWidth: 3, // Border putih untuk kontras
    borderColor: Colors.cardBackground, // Border putih
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({ // Tambahkan shadow untuk kedalaman
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.accentColor,
    fontWeight: '600',
    marginTop: 5,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: Colors.textMedium,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 14,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primaryGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveText: {
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: '700',
  },
});