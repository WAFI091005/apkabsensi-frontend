import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Siswa = { id: number; nama: string; kelas: string; nis?: string };
type Kelas = { nama: string };

export default function RosterSiswa() {
  const [loading, setLoading]   = useState(true);
  const [kelas, setKelas]       = useState<Kelas[]>([]);
  const [pilihKelas, setPilih]  = useState<string | null>(null);
  const [data, setData]         = useState<Siswa[]>([]);

  /** ambil daftar kelas */
  const fetchKelas = async (token: string) => {
    const r = await fetch('http://192.168.233.77:8000/api/kelas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setKelas(await r.json());              // [{nama:'XII IPA 1'}, …]
  };

  /** ambil siswa (all or by kelas) */
  const fetchSiswa = async (token: string, kelas?: string | null) => {
    const url = kelas
      ? `http://192.168.233.77:8000/api/kelas/${encodeURIComponent(kelas)}/siswa`
      : 'http://192.168.233.77:8000/api/siswa';

    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    setData(await r.json());
  };

  /** load awal */
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      await Promise.all([fetchKelas(token), fetchSiswa(token, null)]);
      setLoading(false);
    })();
  }, []);

  /** kalau pilih kelas berubah, fetch ulang siswa */
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      fetchSiswa(token, pilihKelas);
    })();
  }, [pilihKelas]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /** ─── UI ─── */
  return (
    <View style={styles.container}>
      {/* FILTER KELAS */}
      <FlatList
        horizontal
        data={[{ nama: 'Semua' }, ...kelas]}
        keyExtractor={(i) => i.nama}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 6 }}
        renderItem={({ item }) => {
          const selected = pilihKelas === (item.nama === 'Semua' ? null : item.nama);
          return (
            <Pressable
              onPress={() => setPilih(item.nama === 'Semua' ? null : item.nama)}
              style={[
                styles.chip,
                selected && { backgroundColor: '#6C63FF' },
              ]}
            >
              <Text style={[styles.chipText, selected && { color: '#FFF' }]}>
                {item.nama}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* LIST SISWA */}
      <FlatList
        data={data}
        keyExtractor={(i) => i.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Feather name="user" size={18} color="#6C63FF" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nama}>{item.nama}</Text>
              <Text style={styles.sub}>{item.kelas} {item.nis ? `• ${item.nis}` : ''}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* chip filter */
  chip: {
    borderWidth: 1, borderColor: '#6C63FF', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6, marginRight: 10,
  },
  chipText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },

  /* list */
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
         padding: 14, borderRadius: 10, elevation: 1 },
  nama: { fontWeight: '600', fontSize: 15 },
  sub:  { color: '#666', fontSize: 12 },
});
