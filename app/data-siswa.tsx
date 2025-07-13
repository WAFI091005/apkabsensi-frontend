import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import i18n from '@/i18n';
import { useLanguage } from './_layout';

const Colors = {
  primary: "#4CAF50",
  primaryLight: "#66BB6A", // Lighter green for gradients (kept original for this file)
  background: "#F0F4F8",
  cardBackground: "#FFFFFF",
  textDark: "#263238", // Using textDark for primary text (consistent with HomeGuru)
  textMedium: "#546E7A", // Using textMedium for secondary text (consistent with HomeGuru)
  textLight: "#ECEFF1",
  accent: "#FFEB3B",
  shadowColor: "#000",
};

interface Kelas {
  nama: string; // <<< INI YANG DIUBAH: dari 'kelas' menjadi 'nama'
  total?: number; // Menambahkan ini sebagai properti opsional jika ingin menggunakan 'total'
}

interface Siswa {
  id: number;
  name: string;
  email: string;
  kelas: string; // Tetap 'kelas' di sini karena data siswa memiliki properti 'kelas'
  nama_siswa: string;
  absen: string | null;
}

export default function DataSiswa() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loadingKelas, setLoadingKelas] = useState(true);
  const [loadingSiswa, setLoadingSiswa] = useState(false);
  const router = useRouter();
  const { locale } = useLanguage();

  useEffect(() => {
    fetchKelas();
  }, [locale]);

  const fetchKelas = async () => {
    setLoadingKelas(true);
    try {
      const res = await fetch("http://192.168.233.77:8000/api/kelas");
      const data = await res.json();
      setKelasList(data);
      if (data.length > 0) {
        // <<< INI YANG DIUBAH: menggunakan data[0].nama
        fetchSiswaByKelas(data[0].nama); 
      } else {
        setSelectedKelas(null);
        setSiswaList([]);
      }
    } catch (err) {
      console.error("❌ Gagal ambil data kelas:", err);
      Alert.alert(i18n.t('error'), i18n.t('failed_to_fetch_classes'));
      setKelasList([]);
    } finally {
      setLoadingKelas(false);
    }
  };

  const fetchSiswaByKelas = async (kelas: string) => {
    setSelectedKelas(kelas);
    setLoadingSiswa(true);
    setSiswaList([]);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.warn(i18n.t('empty_token_redirect_login'));
        router.replace("/login");
        return;
      }

      const res = await fetch(`http://192.168.233.77:8000/api/kelas/${kelas}/siswa`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error response:", errorText);
        Alert.alert(i18n.t('error'), `${i18n.t('failed_to_fetch_students')} (Status: ${res.status})`);
        setSiswaList([]);
        return;
      }

      const text = await res.text();
      try {
        const json: Siswa[] = JSON.parse(text);
        setSiswaList(json);
      } catch (e) {
        console.error("❌ JSON Parse Error (HTML?):", text);
        Alert.alert(i18n.t('error'), i18n.t('json_parse_error'));
        setSiswaList([]);
      }
    } catch (err) {
      console.error("❌ Gagal ambil siswa:", err);
      Alert.alert(i18n.t('error'), `${i18n.t('failed_to_fetch_students')} - ${String(err)}`);
      setSiswaList([]);
    } finally {
      setLoadingSiswa(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.pageTitle}>{i18n.t('student_data_title')}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {loadingKelas ? (
          <ActivityIndicator color={Colors.primary} size="large" style={styles.loadingIndicator} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kelasWrapper}>
            {kelasList.length === 0 ? (
                <Text style={styles.emptyMessage}>{i18n.t('no_class_selected')}</Text>
            ) : (
                kelasList.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.kelasButton,
                            // <<< INI YANG DIUBAH: menggunakan item.nama
                            selectedKelas === item.nama && styles.kelasButtonActive, 
                        ]}
                        // <<< INI YANG DIUBAH: menggunakan item.nama
                        onPress={() => fetchSiswaByKelas(item.nama)} 
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.kelasText,
                                // <<< INI YANG DIUBAH: menggunakan item.nama
                                selectedKelas === item.nama && styles.kelasTextActive, 
                            ]}
                        >
                            {item.nama} {/* <<< INI YANG DIUBAH: menggunakan item.nama */}
                        </Text>
                    </TouchableOpacity>
                ))
            )}
          </ScrollView>
        )}

        {selectedKelas && (
          <View style={styles.siswaContainer}>
            <Text style={styles.sectionTitle}>
                {/* <<< INI YANG DIUBAH: menggunakan { kelas: selectedKelas } */}
                {i18n.t('class_students_title', { kelas: selectedKelas })} 
            </Text>
            {loadingSiswa ? (
              <ActivityIndicator color={Colors.primary} size="large" style={styles.loadingIndicator} />
            ) : (
              siswaList.length === 0 ? (
                <Text style={styles.emptyMessage}>{i18n.t('no_students_in_class')}</Text>
              ) : (
                <FlatList
                  data={siswaList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.siswaItem}>
                      <Text style={styles.siswaNama}>{item.nama_siswa}</Text>
                      <Text style={styles.siswaDetail}>📧 {item.email}</Text>
                      <Text style={styles.siswaDetail}>👤 {item.name}</Text>
                      <Text style={styles.siswaDetail}>
                        📝 {i18n.t('absentee')}: {item.absen ?? i18n.t('not_yet_absent')}
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              )
            )}
          </View>
        )}
        {/* <<< INI YANG DIUBAH: Tampilkan pesan instruksi jika tidak ada kelas yang dipilih, tapi ada kelas yang tersedia */}
        {!selectedKelas && !loadingKelas && kelasList.length > 0 && (
            <Text style={styles.instructionMessage}>{i18n.t('no_class_selected')}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  kelasWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 25,
    justifyContent: "center",
    width: '100%', 
  },
  kelasButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  kelasButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  kelasText: {
    fontSize: 16,
    color: Colors.textDark, // Konsisten dengan HomeGuru
    fontWeight: "500",
  },
  kelasTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textDark, // Konsisten dengan HomeGuru
    marginBottom: 15,
    textAlign: "left",
  },
  siswaContainer: {
    flex: 1,
  },
  siswaItem: {
    backgroundColor: Colors.cardBackground,
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  siswaNama: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.textDark, // Konsisten dengan HomeGuru
    marginBottom: 5,
  },
  siswaDetail: {
    fontSize: 14,
    color: Colors.textMedium, // Konsisten dengan HomeGuru
    marginBottom: 3,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.background,
    marginVertical: 8,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textMedium,
    textAlign: 'center',
    marginTop: 20,
  },
  instructionMessage: {
    fontSize: 16,
    color: Colors.textMedium,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
});