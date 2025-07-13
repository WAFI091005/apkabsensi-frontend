import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function InputAbsen() {
  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [siswaId, setSiswaId] = useState<string>('');
  const [status, setStatus] = useState<string>('hadir');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token tidak ditemukan');
        return;
      }

      const res = await axios.get('http://192.168.233.77:8000/api/siswa', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSiswaList(res.data);
    } catch (err) {
      Alert.alert('Gagal', 'Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleAbsen = async () => {
    if (!siswaId || !status) {
      Alert.alert('Validasi', 'Pilih siswa dan status absen');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token tidak ditemukan');
        return;
      }

      const today = new Date();
      const tanggal =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

      await axios.post(
        'http://192.168.233.77:8000/api/kehadiran',
        {
          siswa_id: siswaId,
          tanggal,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      Alert.alert('Sukses', 'Absen berhasil dikirim!');
      setSiswaId('');
      setStatus('hadir');
    } catch (error: any) {
      console.log("DETAIL ERROR:", JSON.stringify(error.response?.data));
      Alert.alert('Gagal', error.response?.data?.message || 'Gagal mengirim absen');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={{ marginTop: 10 }}>Memuat data siswa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pilih Siswa:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={siswaId}
          onValueChange={(itemValue: string) => setSiswaId(itemValue)}
        >
          <Picker.Item label="-- Pilih Siswa --" value="" />
          {siswaList.map((siswa) => (
            <Picker.Item
              key={siswa.id}
              label={`${siswa.nama} (${siswa.kelas})`}
              value={siswa.id.toString()}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Status Absen:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue: string) => setStatus(itemValue)}
        >
          <Picker.Item label="Hadir" value="hadir" />
          <Picker.Item label="Izin" value="izin" />
          <Picker.Item label="Sakit" value="sakit" />
          <Picker.Item label="Alpha" value="alpha" />
        </Picker>
      </View>

      <Button title="Kirim Absen" onPress={handleAbsen} color="#28a745" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 50,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    marginBottom: 12,
  },
});
