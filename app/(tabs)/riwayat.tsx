// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import { LinearGradient } from 'expo-linear-gradient';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   SafeAreaView,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// export default function RiwayatAbsen() {
//   const [riwayat, setRiwayat] = useState<any[]>([]);
//   const [filteredRiwayat, setFilteredRiwayat] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
//   const [selectedStatus, setSelectedStatus] = useState<string>('semua');

//   const fetchRiwayat = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await fetch('http://192.168.126.77:8000/api/riwayat-saya', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Gagal mengambil data');
//       }
//       const data = await response.json();
//       setRiwayat(data);
//     } catch (error) {
//       console.error('Gagal mengambil riwayat', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchRiwayat();
//   };

//   useEffect(() => {
//     fetchRiwayat();
//   }, []);

//   useEffect(() => {
//     const filtered = riwayat.filter(item => {
//       const date = new Date(item.tanggal);
//       const matchMonth = date.getMonth() + 1 === selectedMonth;
//       const matchYear = date.getFullYear() === selectedYear;
//       const matchStatus = selectedStatus === 'semua' || item.status.toLowerCase() === selectedStatus;
//       return matchMonth && matchYear && matchStatus;
//     });
//     setFilteredRiwayat(filtered);
//   }, [riwayat, selectedMonth, selectedYear, selectedStatus]);

//   const getStatusColor = (status: string): [string, string] => {
//     switch (status?.toLowerCase()) {
//       case 'hadir': return ['#00b894', '#00cec9'];
//       case 'izin': return ['#6c5ce7', '#a29bfe'];
//       case 'sakit': return ['#fd79a8', '#fdcb6e'];
//       case 'alpha': return ['#e17055', '#d63031'];
//       default: return ['#b2bec3', '#dfe6e9'];
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'hadir': return '✅';
//       case 'izin': return '📋';
//       case 'sakit': return '🤒';
//       case 'alpha': return '❌';
//       default: return '📊';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('id-ID', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const getDayName = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('id-ID', { weekday: 'long' });
//   };

//   const getStatistics = () => {
//     const total = riwayat.filter(item => {
//       const date = new Date(item.tanggal);
//       return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
//     });

//     const hadir = total.filter(item => item.status.toLowerCase() === 'hadir').length;
//     const izin = total.filter(item => item.status.toLowerCase() === 'izin').length;
//     const sakit = total.filter(item => item.status.toLowerCase() === 'sakit').length;
//     const alpha = total.filter(item => item.status.toLowerCase() === 'alpha').length;

//     return { total: total.length, hadir, izin, sakit, alpha };
//   };

//   const stats = getStatistics();

//   if (loading) {
//     return (
//       <LinearGradient colors={['#667eea', '#764ba2']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <View style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           padding: 30,
//           borderRadius: 20,
//           alignItems: 'center',
//         }}>
//           <ActivityIndicator size="large" color="#667eea" />
//           <Text style={{ marginTop: 15, fontSize: 16, color: '#667eea', fontWeight: '600' }}>
//             Memuat riwayat absensi...
//           </Text>
//         </View>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={{ flex: 1 }}>
//       <SafeAreaView style={{ flex: 1 }}>
//         <LinearGradient
//           colors={['#667eea', '#764ba2']}
//           style={{
//             paddingTop: 20,
//             paddingBottom: 30,
//             paddingHorizontal: 20,
//             borderBottomLeftRadius: 25,
//             borderBottomRightRadius: 25,
//           }}
//         >
//           <Text style={{
//             fontSize: 28,
//             fontWeight: 'bold',
//             color: '#ffffff',
//             textAlign: 'center',
//             marginBottom: 10,
//           }}>
//             📊 Riwayat Absensi
//           </Text>
//           <Text style={{
//             fontSize: 16,
//             color: 'rgba(255, 255, 255, 0.8)',
//             textAlign: 'center',
//           }}>
//             Total {stats.total} hari tercatat
//           </Text>
//         </LinearGradient>

//         {/* Filter Bulan & Tahun */}
//         <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 15 }}>
//           <Picker
//             selectedValue={selectedMonth}
//             onValueChange={(val) => setSelectedMonth(val)}
//             style={{ flex: 1 }}
//           >
//             {[...Array(12)].map((_, i) => (
//               <Picker.Item key={i} label={`Bulan ${i + 1}`} value={i + 1} />
//             ))}
//           </Picker>
//           <Picker
//             selectedValue={selectedYear}
//             onValueChange={(val) => setSelectedYear(val)}
//             style={{ flex: 1 }}
//           >
//             {[2023, 2024, 2025, 2026].map(year => (
//               <Picker.Item key={year} label={`Tahun ${year}`} value={year} />
//             ))}
//           </Picker>
//         </View>

//         {/* Statistik Filter */}
//         <View style={{
//           flexDirection: 'row',
//           flexWrap: 'wrap',
//           justifyContent: 'space-between',
//           paddingHorizontal: 20,
//           paddingVertical: 20,
//         }}>
//           {[
//             { label: 'Hadir', value: stats.hadir, color: ['#00b894', '#00cec9'] as const },
//             { label: 'Izin', value: stats.izin, color: ['#6c5ce7', '#a29bfe'] as const },
//             { label: 'Sakit', value: stats.sakit, color: ['#fd79a8', '#fdcb6e'] as const },
//             { label: 'Alpha', value: stats.alpha, color: ['#e17055', '#d63031'] as const },
//           ].map((item, index) => {
//             const isActive = selectedStatus === item.label.toLowerCase();
//             return (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => setSelectedStatus(isActive ? 'semua' : item.label.toLowerCase())}
//                 style={{ width: '47%', marginBottom: 12 }}
//               >
//                 <LinearGradient
//                   colors={item.color}
//                   style={{
//                     padding: 15,
//                     borderRadius: 15,
//                     alignItems: 'center',
//                     opacity: isActive ? 1 : 0.6,
//                   }}
//                 >
//                   <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
//                     {item.value}
//                   </Text>
//                   <Text style={{ fontSize: 12, color: '#fff' }}>
//                     {item.label}
//                   </Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* Daftar Riwayat */}
//         {filteredRiwayat.length === 0 ? (
//           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
//             <Text style={{ fontSize: 64, marginBottom: 20 }}>📋</Text>
//             <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2d3436', marginBottom: 10 }}>
//               Tidak Ada Riwayat
//             </Text>
//             <Text style={{ fontSize: 16, color: '#636e72', textAlign: 'center', lineHeight: 24 }}>
//               Coba ubah bulan/tahun atau reset filter status
//             </Text>
//           </View>
//         ) : (
//           <FlatList
//             data={filteredRiwayat}
//             keyExtractor={(item) => item.id.toString()}
//             showsVerticalScrollIndicator={false}
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
//             renderItem={({ item }) => (
//               <View style={{ marginBottom: 15 }}>
//                 <LinearGradient
//                   colors={['#ffffff', '#f8f9fa']}
//                   style={{
//                     borderRadius: 16,
//                     padding: 20,
//                     shadowColor: '#000',
//                     shadowOffset: { width: 0, height: 2 },
//                     shadowOpacity: 0.1,
//                     shadowRadius: 3.84,
//                     elevation: 5,
//                     borderWidth: 1,
//                     borderColor: 'rgba(255, 255, 255, 0.8)',
//                   }}
//                 >
//                   <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
//                     <View style={{
//                       width: 50,
//                       height: 50,
//                       borderRadius: 25,
//                       backgroundColor: '#f1f3f4',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginRight: 15,
//                     }}>
//                       <Text style={{ fontSize: 18 }}>{getStatusIcon(item.status)}</Text>
//                     </View>
//                     <View style={{ flex: 1 }}>
//                       <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2d3436', marginBottom: 2 }}>
//                         {getDayName(item.tanggal)}
//                       </Text>
//                       <Text style={{ fontSize: 14, color: '#636e72', marginBottom: 8 }}>
//                         {formatDate(item.tanggal)}
//                       </Text>
//                     </View>
//                   </View>
//                   <LinearGradient
//                     colors={getStatusColor(item.status)}
//                     style={{
//                       paddingHorizontal: 16,
//                       paddingVertical: 10,
//                       borderRadius: 12,
//                       alignSelf: 'flex-start',
//                     }}
//                   >
//                     <Text style={{
//                       color: '#ffffff',
//                       fontSize: 14,
//                       fontWeight: 'bold',
//                       textTransform: 'uppercase',
//                       letterSpacing: 0.5,
//                     }}>
//                       {item.status}
//                     </Text>
//                   </LinearGradient>
//                 </LinearGradient>
//               </View>
//             )}
//           />
//         )}
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

import { Ionicons } from '@expo/vector-icons'; // Pastikan ini terinstal: expo install @expo/vector-icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Define a modern and sophisticated color palette
const Colors = {
  primaryBlue: '#3F51B5', // Deep Blue
  primaryBlueLight: '#7986CB', // Lighter Blue
  backgroundLight: '#F0F4F8', // Light blue-grey background
  cardBackground: '#FFFFFF', // Pure white for cards
  textDark: '#263238', // Dark charcoal for primary text
  textMedium: '#546E7A', // Muted grey for secondary text
  textLight: '#ECEFF1', // Very light grey for header info
  shadowColor: '#000',

  // Status colors - refined for better gradients
  statusHadir: ['#4CAF50', '#8BC34A'] as const, // <--- Added 'as const'
  statusIzin: ['#FFC107', '#FFD54F'] as const,   // <--- Added 'as const'
  statusSakit: ['#2196F3', '#64B5F6'] as const,  // <--- Added 'as const'
  statusAlpha: ['#F44336', '#EF5350'] as const,  // <--- Added 'as const'
  statusDefault: ['#B0BEC5', '#E0E0E0'] as const, // <--- Added 'as const'
};

export default function RiwayatAbsen() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [filteredRiwayat, setFilteredRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState<string>('semua');

  // Function to fetch attendance history from the API
  const fetchRiwayat = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.233.77:8000/api/riwayat-saya', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data with status: ${response.status}`);
      }
      const data = await response.json();
      setRiwayat(data);
    } catch (error) {
      console.error('Gagal mengambil riwayat:', error);
      // Optionally show an alert to the user here
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handler for pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRiwayat();
  };

  // Fetch data on initial component mount
  useEffect(() => {
    fetchRiwayat();
  }, []);

  // Filter riwayat whenever dependencies change
  useEffect(() => {
    const filtered = riwayat.filter(item => {
      const date = new Date(item.tanggal);
      const matchMonth = date.getMonth() + 1 === selectedMonth;
      const matchYear = date.getFullYear() === selectedYear;
      const matchStatus = selectedStatus === 'semua' || item.status.toLowerCase() === selectedStatus;
      return matchMonth && matchYear && matchStatus;
    });
    setFilteredRiwayat(filtered);
  }, [riwayat, selectedMonth, selectedYear, selectedStatus]);

  // Helper function to get gradient colors based on status
  const getStatusColor = (status: string): readonly [string, string] => { // <--- Changed return type to 'readonly [string, string]'
    switch (status?.toLowerCase()) {
      case 'hadir': return Colors.statusHadir;
      case 'izin': return Colors.statusIzin;
      case 'sakit': return Colors.statusSakit;
      case 'alpha': return Colors.statusAlpha;
      default: return Colors.statusDefault;
    }
  };

  // Helper function to get Ionicons based on status
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'hadir': return <Ionicons name="checkmark-circle-outline" size={24} color={Colors.primaryBlue} />;
      case 'izin': return <Ionicons name="document-text-outline" size={24} color={Colors.primaryBlue} />;
      case 'sakit': return <Ionicons name="medkit-outline" size={24} color={Colors.primaryBlue} />;
      case 'alpha': return <Ionicons name="close-circle-outline" size={24} color={Colors.primaryBlue} />;
      default: return <Ionicons name="stats-chart-outline" size={24} color={Colors.primaryBlue} />;
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to get day name
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
  };

  // Calculate monthly statistics
  const getStatistics = () => {
    const total = riwayat.filter(item => {
      const date = new Date(item.tanggal);
      return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
    });

    const hadir = total.filter(item => item.status.toLowerCase() === 'hadir').length;
    const izin = total.filter(item => item.status.toLowerCase() === 'izin').length;
    const sakit = total.filter(item => item.status.toLowerCase() === 'sakit').length;
    const alpha = total.filter(item => item.status.toLowerCase() === 'alpha').length;

    return { total: total.length, hadir, izin, sakit, alpha };
  };

  const stats = getStatistics();

  // --- Loading State UI ---
  if (loading) {
    return (
      <LinearGradient colors={[Colors.primaryBlue, Colors.primaryBlueLight]} style={styles.centeredContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
          <Text style={styles.loadingText}>Memuat riwayat absensi Anda...</Text>
        </View>
      </LinearGradient>
    );
  }

  // --- Main Content UI ---
  return (
    <LinearGradient colors={[Colors.backgroundLight, Colors.backgroundLight]} style={styles.fullScreenGradient}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primaryBlue, Colors.primaryBlueLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>
            <Ionicons name="stats-chart-outline" size={30} color={Colors.cardBackground} /> Riwayat Absensi
          </Text>
          <Text style={styles.headerSubtitle}>
            Total {stats.total} hari tercatat di bulan ini
          </Text>
        </LinearGradient>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(val) => setSelectedMonth(val)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {[...Array(12)].map((_, i) => (
                <Picker.Item key={i} label={new Date(0, i).toLocaleString('id-ID', { month: 'long' })} value={i + 1} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(val) => setSelectedYear(val)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {[2023, 2024, 2025, 2026].map(year => (
                <Picker.Item key={year} label={`${year}`} value={year} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Hadir', value: stats.hadir, status: 'hadir', colors: Colors.statusHadir },
            { label: 'Izin', value: stats.izin, status: 'izin', colors: Colors.statusIzin },
            { label: 'Sakit', value: stats.sakit, status: 'sakit', colors: Colors.statusSakit },
            { label: 'Alpha', value: stats.alpha, status: 'alpha', colors: Colors.statusAlpha },
          ].map((item, index) => {
            const isActive = selectedStatus === item.status;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedStatus(isActive ? 'semua' : item.status)}
                style={styles.statCardWrapper}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isActive ? item.colors : Colors.statusDefault} // Use active color or default grey
                  style={styles.statCard}
                >
                  <Text style={styles.statValue}>
                    {item.value}
                  </Text>
                  <Text style={styles.statLabel}>
                    {item.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* History List */}
        {filteredRiwayat.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={72} color={Colors.textMedium} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Tidak Ada Riwayat Absensi</Text>
            <Text style={styles.emptyText}>
              Coba ubah bulan/tahun atau reset filter status untuk melihat data lain.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRiwayat}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.listItemContainer}>
                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <View style={styles.statusIconCircle}>
                      {getStatusIcon(item.status)}
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.dayName}>{getDayName(item.tanggal)}</Text>
                      <Text style={styles.fullDate}>{formatDate(item.tanggal)}</Text>
                    </View>
                  </View>
                  <LinearGradient
                    colors={getStatusColor(item.status)}
                    style={styles.statusBadge}
                  >
                    <Text style={styles.statusBadgeText}>
                      {item.status.toUpperCase()}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// ---
// Styles
// ---
const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // Make SafeAreaView background transparent to show gradient
  },
  // Loading State Styles
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: Colors.cardBackground,
    padding: 35,
    borderRadius: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loadingText: {
    marginTop: 18,
    fontSize: 17,
    color: Colors.primaryBlue,
    fontWeight: '600',
  },
  // Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15, // Space before filter/stats section
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
    color: Colors.cardBackground,
    textAlign: 'center',
    marginBottom: 8,
    flexDirection: 'row', // To align icon and text
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
  // Filter Section
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
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
    overflow: 'hidden', // Ensures borderRadius clips content
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
  // Statistics Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  statCardWrapper: {
    width: '48%', // Almost half width with some gap
    marginBottom: 12,
  },
  statCard: {
    padding: 18,
    borderRadius: 18, // More rounded stats cards
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.cardBackground, // White text for stats
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.cardBackground, // White text for labels
    fontWeight: '500',
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'transparent', // Use transparent to show background gradient
  },
  emptyIcon: {
    marginBottom: 25,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },
  // List Item Styles
  listContainer: {
    paddingHorizontal: 15, // Match horizontal padding
    paddingTop: 10,
    paddingBottom: 30, // More padding at the bottom of the list
  },
  listItemContainer: {
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 18, // More rounded list items
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: '#EFEFEF', // Very light border
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.backgroundLight, // Light background for the icon circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 4,
  },
  fullDate: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15, // More rounded badge
    minWidth: 90, // Ensure badge has minimum width
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statusBadgeText: {
    color: Colors.cardBackground, // White text for badge
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});