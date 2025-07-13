import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type Kelas = { nama: string; total: number };

export default function KelolaKelas() {
  const router = useRouter();
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKelas = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch('http://192.168.233.77:8000/api/kelas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setKelas(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchKelas(); }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={kelas}
        keyExtractor={(i) => i.nama}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
            onPress={() => router.push({ pathname: "/kelas/[nama]", params: { nama: item.nama } })}

          >
            <Text style={styles.nama}>{item.nama}</Text>
            <Text style={styles.total}>{item.total} siswa</Text>
            <Feather name="chevron-right" size={18} color="#AAA" />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 16, elevation: 2 },
  nama: { flex: 1, fontSize: 16, fontWeight: '600' },
  total: { marginRight: 8, color: '#666' },
});
