import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function DetailKelas() {
  const { nama } = useLocalSearchParams<{ nama: string }>();
  const [siswa, setSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSiswa = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`http://192.168.233.77:8000/api/kelas/${encodeURIComponent(nama)}/siswa`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSiswa(await res.json());
    setLoading(false);
  };
  useEffect(() => { fetchSiswa(); }, []);

  const hapus = (id: number) =>
    Alert.alert('Hapus?', 'Yakin?', [
      { text: 'Batal' },
      {
        text: 'Hapus', style: 'destructive', onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          await fetch(`http://192.168.233.77:8000/api/siswa/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchSiswa();
        },
      },
    ]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={siswa}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>{item.nama_siswa}</Text>
            <Pressable onPress={() => hapus(item.id)}>
              <Feather name="trash-2" color="#E74C3C" size={18} />
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 10 },
});
