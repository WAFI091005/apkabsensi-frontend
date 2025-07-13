import { Ionicons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar, // Import StatusBar
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import axios from "./lib/axiosInstance"; // Sesuaikan path axios

// Import i18n dan useLanguage
import i18n from '@/i18n';
import { useLanguage } from './_layout'; // Sesuaikan path jika berbeda

// Warna hijau tema utama
const Colors = {
  primaryGreen: '#388E3C',
  primaryGreenLight: '#66BB6A',
  background: '#F0F4F8',
  cardBackground: '#FFFFFF',
  textDark: '#263238',
  textMedium: '#546E7A',
  textLight: '#ECEFF1',
  shadowColor: '#000',
  statusHadir: '#388E3C',
  statusSakit: '#FFC107',
  statusIzin: '#2196F3',
  statusAlpha: '#F44336',
  statusBelum: '#9E9E9E',
  massAbsenButton: ['#388E3C', '#66BB6A'],
  massAbsenButtonText: '#FFFFFF',
};

// --- PERBAIKAN UTAMA: Interface Kelas menggunakan 'nama' ---
interface Kelas {
  nama: string; // <<< DITAMBAHKAN: Menggunakan 'nama' sesuai respons API
  total?: number; // Opsional jika data API Anda menyertakan ini
}
// --- AKHIR PERBAIKAN INTERFACE ---

interface Siswa {
  nama: string;
  status: "hadir" | "sakit" | "izin" | "alpha" | null;
}

export default function ScanQRScreen() {
  const { locale } = useLanguage();
  const [selectedClass, setSelectedClass] = useState("");
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loadingKelas, setLoadingKelas] = useState(true);
  const [loadingSiswa, setLoadingSiswa] = useState(false);
  const [isMassAbsenLoading, setIsMassAbsenLoading] = useState(false);

  useEffect(() => {
    fetchKelas();
  }, [locale]);

  useEffect(() => {
    if (selectedClass) fetchSiswa(selectedClass);
    else setSiswaList([]);
  }, [selectedClass, locale]);

  const fetchKelas = async () => {
    setLoadingKelas(true);
    try {
      const res = await axios.get("/kelas");
      setKelasList(res.data);
      if (res.data.length > 0 && !selectedClass) {
        // <<< DITAMBAHKAN: Menggunakan res.data[0].nama
        setSelectedClass(res.data[0].nama); 
      }
    } catch (err) {
      console.error("❌ Gagal ambil kelas:", err);
      Alert.alert(i18n.t('error'), i18n.t('failed_to_fetch_classes'));
    } finally {
      setLoadingKelas(false);
    }
  };

  const fetchSiswa = async (kelas: string) => {
    setLoadingSiswa(true);
    try {
      const res = await axios.get(`/kelas/${kelas}/siswa`);
      const siswaFormatted = res.data.map((item: any) => ({
        nama: item.nama_siswa || item.nama, 
        status: item.absen ?? null,
      }));
      setSiswaList(siswaFormatted);
    } catch (err) {
      console.error("❌ Gagal ambil siswa:", err);
      Alert.alert(i18n.t('error'), `${i18n.t('failed_to_fetch_students')} - ${String(err)}`);
      setSiswaList([]);
    } finally {
      setLoadingSiswa(false);
    }
  };

  const handleMassAbsen = async () => {
    if (!selectedClass) {
      Alert.alert(i18n.t('info'), i18n.t('select_class_first'));
      return;
    }

    Alert.alert(
      i18n.t('confirm_mass_absent_title'),
      i18n.t('confirm_mass_absent_message', { kelas: selectedClass }),
      [
        { text: i18n.t('cancel'), style: "cancel" },
        {
          text: i18n.t('yes'),
          onPress: async () => {
            setIsMassAbsenLoading(true);
            try {
              const res = await axios.post(`/kelas/${selectedClass}/absen-semua`);
              Alert.alert(i18n.t('success'), res.data.message || i18n.t('mass_absent_success'));
              fetchSiswa(selectedClass);
            } catch (err: any) {
              console.error('Mass absen failed:', err.response?.data || err.message);
              Alert.alert(i18n.t('failed'), err.response?.data?.message || i18n.t('mass_absent_failed'));
            } finally {
              setIsMassAbsenLoading(false);
            }
          },
        },
      ]
    );
  };

  const qrValue = selectedClass
    ? JSON.stringify({ kelas: selectedClass, timestamp: Date.now() })
    : "";

  const getStatusDisplay = useMemo(() => (status: Siswa["status"]) => {
    switch (status) {
      case "hadir": return i18n.t('status_present');
      case "sakit": return i18n.t('status_sick');
      case "izin": return i18n.t('status_permission');
      case "alpha": return i18n.t('status_absent');
      default: return i18n.t('status_not_yet');
    }
  }, [locale]);

  const getStatusColor = (status: Siswa["status"]) => {
    switch (status) {
      case "hadir": return Colors.statusHadir;
      case "sakit": return Colors.statusSakit;
      case "izin": return Colors.statusIzin;
      case "alpha": return Colors.statusAlpha;
      default: return Colors.statusBelum;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryGreen} />

      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={[Colors.primaryGreen, Colors.primaryGreenLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>
            <Ionicons name="qr-code-outline" size={30} color={Colors.textLight} /> {i18n.t('qr_attendance_title')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {i18n.t('select_class_for_qr_and_list')}
          </Text>
        </LinearGradient>

        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.section}>
                <Text style={styles.label}>{i18n.t('select_class')}:</Text>
                <View style={styles.pickerWrapper}>
                  {loadingKelas ? (
                    <ActivityIndicator size="small" color={Colors.primaryGreen} style={styles.pickerLoading} />
                  ) : (
                    <Picker
                      selectedValue={selectedClass}
                      onValueChange={(itemValue) => setSelectedClass(itemValue)}
                      style={styles.picker}
                      itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
                    >
                      <Picker.Item label={i18n.t('select_class_placeholder')} value="" />
                      {kelasList.map((item, index) => (
                        // --- DITAMBAHKAN: Menggunakan item.nama ---
                        <Picker.Item key={index} label={item.nama} value={item.nama} />
                      ))}
                    </Picker>
                  )}
                </View>
                {kelasList.length === 0 && !loadingKelas && (
                    <Text style={styles.emptyMessage}>{i18n.t('no_classes_available')}</Text>
                )}
              </View>

              {selectedClass ? (
                <>
                  <View style={styles.section}>
                    <View style={styles.qrCard}>
                      <QRCode
                        value={qrValue}
                        size={200}
                        backgroundColor="transparent"
                        color={Colors.textDark}
                      />
                      <Text style={styles.qrTitle}>{i18n.t('qr_for_class', { kelas: selectedClass })}</Text>
                      <Text style={styles.qrSub}>{i18n.t('scan_to_absent')}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.massAbsenButton}
                      onPress={handleMassAbsen}
                      disabled={isMassAbsenLoading}
                      activeOpacity={0.8}
                    >
                      {isMassAbsenLoading ? (
                        <ActivityIndicator size="small" color={Colors.massAbsenButtonText} />
                      ) : (
                        <>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={20}
                            color={Colors.massAbsenButtonText}
                            style={styles.buttonIcon}
                          />
                          <Text style={styles.massAbsenButtonText}>
                            {i18n.t('mass_absent_button', { kelas: selectedClass })}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.sectionTitle}>
                    <Ionicons name="people-outline" size={18} color={Colors.textDark} /> {i18n.t('student_list_title')}
                  </Text>
                </>
              ) : (
                !loadingKelas && kelasList.length > 0 && (
                  <Text style={styles.instructionMessage}>{i18n.t('select_class_to_view_list')}</Text>
                )
              )}
            </>
          }
          data={siswaList}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.siswaItem}>
              <Text style={styles.siswaNama}>{item.nama}</Text>
              <Text style={[styles.absenStatus, { color: getStatusColor(item.status) }]}>
                {getStatusDisplay(item.status)}
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            !loadingSiswa && selectedClass ? (
                <Text style={styles.emptyMessage}>{i18n.t('no_students_in_selected_class')}</Text>
            ) : null
          )}
        />
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
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.textDark,
  },
  pickerWrapper: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    justifyContent: 'center',
    height: 50,
  },
  pickerLoading: {
    // Styling for ActivityIndicator inside pickerWrapper
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    color: Colors.textDark,
  },
  qrCard: {
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  qrTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  qrSub: {
    fontSize: 15,
    color: Colors.textMedium,
    textAlign: 'center',
    marginTop: 5,
  },
  massAbsenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 15,
    borderRadius: 15,
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
  massAbsenButtonText: {
    color: Colors.massAbsenButtonText,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  siswaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  siswaNama: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '500',
  },
  absenStatus: {
    fontWeight: '600',
    fontSize: 13,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textMedium,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
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