/* ---------------------------------------------------------- *
 * app/laporan.tsx                                          *
 * Ringkasan kehadiran + filter rentang tanggal + export    *
 * (PDF / Excel download + share)                           *
 * ---------------------------------------------------------- */
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const w = Dimensions.get('window').width;

/* ---------- warna util ---------- */
const Colors = {
  primary: '#4CAF50', // Used for main actions and highlights
  secondary: '#FFC107', // Used for secondary actions/data
  tertiary: '#2196F3', // Another accent color
  danger: '#F44336', // For error or alpha status
  card: '#FFFFFF',
  text: '#263238',
  lightText: '#666',
  background: '#F0F4F8',
  borderColor: '#E0E0E0', // Lighter border for a softer look
  placeholderText: '#9E9E9E', // For empty states or hints
} as const;

/* ---------- helper tanggal ---------- */
const pad = (n: number) => (n < 10 ? `0${n}` : n.toString());
export const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const indo = (d: Date) =>
  d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

/* ---------- helper angka ---------- */
const safeArr = (arr: number[]) => arr.map(v => (Number.isFinite(v) ? v : 0));

/* ====================================================== */
export default function Laporan() {
  /* ----------- state ----------- */
  const today = useMemo(() => new Date(), []);
  const [range, setRange] = useState<{ start: Date; end: Date }>({
    start: today,
    end: today,
  });
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoad] = useState(true);
  const [showPicker, setShow] = useState<'start' | 'end' | null>(null);
  const [kelas, setKelas] = useState<string | null>(null); // if someday filtered by kelas

  /* ----------- fetch API ----------- */
  const load = async () => {
    try {
      setLoad(true);
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(
        `http://192.168.233.77:8000/api/laporan?start=${iso(range.start)}&end=${iso(range.end)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
      setData(null);
      Alert.alert('Error', 'Failed to load report data. Please check your network connection.');
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    load();
  }, [range]);

  /* ----------- download PDF / Excel ----------- */
  const downloadFile = async (type: 'pdf' | 'excel') => {
    try {
      const token = await AsyncStorage.getItem('token');
      const kelasParam = kelas ? `&kelas=${kelas}` : '';
      const url = `http://192.168.233.77:8000/api/laporan/${type}?start=${iso(range.start)}&end=${iso(range.end)}${kelasParam}`;
      const fileName = `laporan_kehadiran_${iso(range.start)}_${iso(range.end)}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      Alert.alert('Mengunduh Laporan', 'Harap tunggu, laporan sedang diunduh...', [{ text: 'OK' }]);

      const { uri } = await FileSystem.downloadAsync(url, fileUri, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert('Gagal Mengunduh', 'Terjadi kesalahan saat mengunduh file. Mohon coba lagi.');
      console.error(e);
    }
  };

  /* ----------- chart dataset ----------- */
  const pieData = useMemo(() => {
    if (!data?.totals) return [];
    const keys = ['hadir', 'izin', 'sakit', 'alpha'] as const;
    return keys
      .map(k => {
        let color;
        switch (k) {
          case 'hadir':
            color = Colors.primary;
            break;
          case 'izin':
            color = Colors.secondary;
            break;
          case 'sakit':
            color = Colors.tertiary;
            break;
          case 'alpha':
            color = Colors.danger;
            break;
        }
        return {
          name: k[0].toUpperCase() + k.slice(1),
          count: Number.isFinite(data.totals[k]) ? data.totals[k] : 0,
          color: color,
          legendFontColor: Colors.text,
          legendFontSize: 12,
        };
      })
      .filter(p => p.count > 0);
  }, [data]);

  const line = useMemo(() => {
    if (!data?.perHari) return { labels: [], hadir: [], izin: [] };
    const labels = Object.keys(data.perHari).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Sort labels chronologically
    return {
      labels: labels.map(date => new Date(date).getDate().toString()), // Display only day for brevity
      hadir: safeArr(labels.map(d => data.perHari[d]?.hadir ?? 0)),
      izin: safeArr(labels.map(d => data.perHari[d]?.izin ?? 0)),
    };
  }, [data]);

  /* =================================================== render */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat laporan...</Text>
      </View>
    );
  }
  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Gagal memuat laporan. Silakan coba lagi.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={load}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ----------------------------- UI ----------------------------- */
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 20 }}>
      {/* ===== Header rentang ===== */}
      <Text style={styles.headerTitle}>Laporan Kehadiran</Text>
      <View style={styles.dateRangeContainer}>
        {(['start', 'end'] as const).map(which => (
          <TouchableOpacity key={which} style={styles.datePickerButton} onPress={() => setShow(which)}>
            <Ionicons name="calendar-outline" size={18} color={Colors.text} />
            <Text style={styles.datePickerText}>
              {which === 'start' ? 'Dari' : 'Sampai'}: <Text style={{ fontWeight: '600' }}>{indo(range[which])}</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ===== Tombol Export ===== */}
      <View style={styles.exportButtonContainer}>
        <TouchableOpacity style={[styles.exportButton, { backgroundColor: Colors.primary }]} onPress={() => downloadFile('pdf')}>
          <Ionicons name="document-text-outline" size={18} color={Colors.card} />
          <Text style={styles.exportButtonText}>Unduh PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportButton, { backgroundColor: Colors.tertiary }]} onPress={() => downloadFile('excel')}>
          {/* Changed icon name here */}
          <Ionicons name="calculator-outline" size={18} color={Colors.card} />
          <Text style={styles.exportButtonText}>Unduh Excel</Text>
        </TouchableOpacity>
      </View>

      {/* ===== Stat ringkas ===== */}
      <View style={styles.statsGrid}>
        {pieData.length > 0 ? (
          pieData.map(p => (
            <View key={p.name} style={[styles.statCard, { borderBottomColor: p.color }]}>
              <Text style={[styles.statValue, { color: p.color }]}>{p.count}</Text>
              <Text style={styles.statLabel}>{p.name}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.placeholderText} />
            <Text style={styles.emptyStateText}>Belum ada data kehadiran pada rentang ini.</Text>
          </View>
        )}
      </View>

      {/* ===== Pie chart ===== */}
      {pieData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartSectionTitle}>Ringkasan Kehadiran</Text>
          <PieChart
            data={pieData}
            width={w - 40} // Adjusted for padding
            height={220}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={chartCfg}
            hasLegend={true} // Show legend for better understanding
            center={[0, 0]}
            style={styles.chartShadow}
          />
        </View>
      )}

      {/* ===== Line chart ===== */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartSectionTitle}>Tren Hadir & Izin per Hari</Text>
        {line.labels.length > 1 ? (
          <LineChart
            data={{
              labels: line.labels,
              datasets: [
                // Removed 'label' property from here
                { data: line.hadir, color: () => Colors.primary, strokeWidth: 2 },
                { data: line.izin, color: () => Colors.secondary, strokeWidth: 2 },
              ],
              legend: ['Hadir', 'Izin'] // Legend for line chart is handled here
            }}
            width={w - 40} // Adjusted for padding
            height={250}
            chartConfig={chartCfg}
            bezier
            style={styles.chartShadow}
          />
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.placeholderText} />
            <Text style={styles.emptyStateText}>
              {line.labels.length === 1
                ? 'Hanya ada data untuk satu hari. Grafik tren membutuhkan lebih banyak data.'
                : 'Belum ada data kehadiran pada rentang tanggal ini untuk menampilkan tren.'}
            </Text>
          </View>
        )}
      </View>

      {/* ===== Date Picker ===== */}
      {showPicker && (
        <DateTimePicker
          value={range[showPicker]}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, sel) => {
            if (sel)
              setRange(r => {
                const n = { ...r, [showPicker]: sel } as typeof range;
                if (n.start > n.end) {
                  showPicker === 'start' ? (n.end = n.start) : (n.start = n.end);
                }
                return n;
              });
            setShow(null);
          }}
        />
      )}
    </ScrollView>
  );
}

/* ====================== Style & chart config ====================== */
const chartCfg = {
  backgroundColor: Colors.card,
  backgroundGradientFrom: Colors.card,
  backgroundGradientTo: Colors.card,
  decimalPlaces: 0,
  fillShadowGradientOpacity: 0.1, // Slight shadow for a subtle effect
  color: (opacity = 1) => `rgba(38,50,56,${opacity})`, // Text color for labels
  labelColor: (opacity = 1) => `rgba(38,50,56,${opacity})`, // Text color for labels
  propsForDots: {
    r: '4', // Radius of dots on the line chart
    strokeWidth: '2',
    stroke: Colors.primary,
  },
  propsForLabels: {
    fontSize: 10,
    fontWeight: '500',
  },
  propsForBackgroundLines: {
    strokeDasharray: '', // Make background lines solid
    stroke: Colors.borderColor,
  },
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text,
    fontSize: 16,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.card,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800', // Bolder title
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute space evenly
    marginBottom: 20,
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  datePickerText: {
    fontSize: 14,
    color: Colors.text,
  },
  exportButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15, // More space between buttons
    marginBottom: 30,
  },
  exportButton: {
    flex: 1, // Make buttons take equal width
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
  },
  exportButtonText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute items evenly
    gap: 15, // Gap between stat cards
    marginBottom: 25,
  },
  statCard: {
    width: '47%', // Slightly less than 50% to allow for gap
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: 15,
    borderBottomWidth: 5, // Thicker bottom border for accent
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statValue: {
    fontSize: 28, // Larger font size for values
    fontWeight: '900', // Extra bold
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.lightText,
    fontWeight: '500',
  },
  emptyStateCard: {
    width: '100%',
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateText: {
    marginTop: 10,
    color: Colors.placeholderText,
    textAlign: 'center',
    fontSize: 14,
  },
  chartContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  chartSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  chartShadow: {
    borderRadius: 16, // Match container border radius
  }
});