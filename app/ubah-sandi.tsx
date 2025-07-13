import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';

export default function UbahSandi() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async () => {
    if (!current || !newPass || !confirm) {
      return Alert.alert('Peringatan', 'Semua kolom wajib diisi');
    }

    if (newPass.length < 6) {
      return Alert.alert('Peringatan', 'Kata sandi minimal 6 karakter');
    }

    if (newPass !== confirm) {
      return Alert.alert('Peringatan', 'Konfirmasi tidak cocok');
    }

    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) return router.replace('/login');

    try {
      const res = await fetch('http://192.168.233.77:8000/api/ubah-sandi', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: current,
          new_password: newPass,
          confirm_password: confirm,
        }),
      });

      if (res.ok) {
        Alert.alert('Berhasil', 'Kata sandi berhasil diubah', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        const err = await res.json();
        Alert.alert('Gagal', err.message || 'Gagal mengubah kata sandi');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Kata Sandi Lama</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Masukkan kata sandi lama"
          value={current}
          onChangeText={setCurrent}
        />

        <Text style={styles.label}>Kata Sandi Baru</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Masukkan kata sandi baru"
          value={newPass}
          onChangeText={setNewPass}
        />

        <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Ulangi kata sandi baru"
          value={confirm}
          onChangeText={setConfirm}
        />

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Feather name="lock" color="#FFF" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Simpan</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  label: {
    marginBottom: 6,
    color: '#555',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
