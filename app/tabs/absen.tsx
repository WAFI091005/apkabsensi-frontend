// import { useFocusEffect } from "@react-navigation/native";
// // import axios from "axios";
// import React, { useCallback, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import axios from "../lib/axiosInstance";

// type Kehadiran = {
//   id: number;
//   siswa_id: number;
//   tanggal: string;
//   status: string;
//   siswa?: {
//     nama: string;
//     kelas: string;
//   };
// };

// export default function AbsenTab() {
//   const [data, setData] = useState<Kehadiran[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get("http://192.168.126.77:8000/api/kehadiran/hari-ini");
//       setData(res.data.data);
//     } catch (err) {
//       console.error("Gagal ambil data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, [])
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#6C63FF" />
//           <Text style={styles.loadingText}>Memuat data absensi...</Text>
//         </View>
//       </View>
//     );
//   }

//   if (data.length === 0) {
//     return (
//       <View style={styles.center}>
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyIcon}>📭</Text>
//           <Text style={styles.emptyTitle}>Belum Ada Data</Text>
//           <Text style={styles.emptySubtitle}>
//             Belum ada data absensi untuk hari ini
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.wrapper}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>📋 Absensi Hari Ini</Text>
//         <Text style={styles.headerSubtitle}>
//           {new Date().toLocaleDateString("id-ID", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </Text>
//       </View>
      
//       <FlatList
//         data={data}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <View style={styles.avatarContainer}>
//                 <Text style={styles.avatarText}>
//                   {item.siswa?.nama?.charAt(0) || "S"}
//                 </Text>
//               </View>
//               <View style={styles.studentInfo}>
//                 <Text style={styles.nama}>{item.siswa?.nama || "Siswa"}</Text>
//                 <Text style={styles.kelas}>🏫 {item.siswa?.kelas || "-"}</Text>
//               </View>
//             </View>
            
//             <View style={styles.cardContent}>
//               <View
//                 style={[
//                   styles.badge,
//                   { backgroundColor: getColor(item.status) },
//                 ]}
//               >
//                 <Text style={styles.badgeIcon}>{getStatusIcon(item.status)}</Text>
//                 <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
//               </View>
//               <Text style={styles.tanggal}>
//                 📅 {new Date(item.tanggal).toLocaleDateString("id-ID")}
//               </Text>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const getColor = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "hadir":
//       return "#4CAF50";
//     case "izin":
//       return "#FF9800";
//     case "sakit":
//       return "#2196F3";
//     case "alpha":
//       return "#F44336";
//     default:
//       return "#9E9E9E";
//   }
// };

// const getStatusIcon = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "hadir":
//       return "✅";
//     case "izin":
//       return "📋";
//     case "sakit":
//       return "🏥";
//     case "alpha":
//       return "❌";
//     default:
//       return "❓";
//   }
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     backgroundColor: "#F8F9FA",
//   },
//   header: {
//     backgroundColor: "#6C63FF",
//     paddingHorizontal: 20,
//     paddingVertical: 24,
//     paddingTop: 40,
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     shadowColor: "#6C63FF",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: "#E8E6FF",
//     textAlign: "center",
//     opacity: 0.9,
//   },
//   container: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: "#F0F0F0",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   avatarContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#6C63FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   avatarText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   studentInfo: {
//     flex: 1,
//   },
//   nama: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#2C3E50",
//     marginBottom: 4,
//   },
//   kelas: {
//     fontSize: 14,
//     color: "#7F8C8D",
//   },
//   cardContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   badgeIcon: {
//     fontSize: 12,
//     marginRight: 4,
//   },
//   badgeText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 12,
//   },
//   tanggal: {
//     fontSize: 14,
//     color: "#7F8C8D",
//     fontWeight: "500",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8F9FA",
//   },
//   loadingContainer: {
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     padding: 32,
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: "#6C63FF",
//     fontWeight: "600",
//   },
//   emptyContainer: {
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     padding: 40,
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//     marginHorizontal: 20,
//   },
//   emptyIcon: {
//     fontSize: 72,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#2C3E50",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   emptySubtitle: {
//     fontSize: 16,
//     color: "#7F8C8D",
//     textAlign: "center",
//     lineHeight: 24,
//   },
// }); 

import { Ionicons } from '@expo/vector-icons'; // Make sure to install: expo install @expo/vector-icons
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient'; // Make sure to install: expo install expo-linear-gradient
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "../lib/axiosInstance";

// Define a modern color palette
const Colors = {
  primary: "#4CAF50", // Fresh Green
  primaryDark: "#388E3C", // Darker Green for gradient
  accent: "#FFC107", // Amber for highlights
  background: "#F8FBF8", // Very light green-grey background
  cardBackground: "#FFFFFF", // Crisp white for cards
  textDark: "#263238", // Dark Grey for primary text
  textMedium: "#546E7A", // Medium Grey for secondary text
  shadowColor: "#000",
};

type Kehadiran = {
  id: number;
  siswa_id: number;
  tanggal: string;
  status: string;
  siswa?: {
    nama: string;
    kelas: string;
  };
};

export default function AbsenTab() {
  const [data, setData] = useState<Kehadiran[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch attendance data from the API
  const fetchData = async () => {
    setLoading(true); // Ensure loading is true every time fetchData is called
    try {
      // Use the local IP address if that's your setup
      const res = await axios.get("http://192.168.233.77:8000/api/kehadiran/hari-ini");
      setData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      // Optionally show an alert to the user
      // Alert.alert("Error", "Gagal memuat data absensi. Silakan coba lagi.");
      setData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Display loading indicator
  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat data absensi...</Text>
        </View>
      </View>
    );
  }

  // Display message if no data is available
  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyContainer}>
          <Ionicons name="documents-outline" size={60} color={Colors.textMedium} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Belum Ada Data Absensi</Text>
          <Text style={styles.emptySubtitle}>
            Absensi untuk hari ini belum tersedia atau kosong.
          </Text>
        </View>
      </View>
    );
  }

  // Helper function to get color based on status
  const getColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "#4CAF50"; // Green
      case "izin":
        return "#FF9800"; // Orange
      case "sakit":
        return "#2196F3"; // Blue
      case "alpha":
        return "#F44336"; // Red
      default:
        return "#9E9E9E"; // Grey
    }
  };

  // Helper function to get icon based on status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />;
      case "izin":
        return <Ionicons name="document-text" size={20} color="#FFFFFF" />;
      case "sakit":
        return <Ionicons name="medical" size={20} color="#FFFFFF" />;
      case "alpha":
        return <Ionicons name="close-circle" size={20} color="#FFFFFF" />;
      default:
        return <Ionicons name="help-circle" size={20} color="#FFFFFF" />;
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Header Section with Gradient */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Absensi Hari Ini</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </LinearGradient>

      {/* List of Attendance Cards */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {/* Avatar with first letter of student's name */}
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {item.siswa?.nama?.charAt(0).toUpperCase() || "S"}
                </Text>
              </View>
              {/* Student Name and Class */}
              <View style={styles.studentInfo}>
                <Text style={styles.nama}>{item.siswa?.nama || "Siswa Tidak Dikenal"}</Text>
                <Text style={styles.kelas}>
                  <Ionicons name="school-outline" size={14} color={Colors.textMedium} />{" "}
                  {item.siswa?.kelas || "Kelas Tidak Diketahui"}
                </Text>
              </View>
            </View>

            {/* Attendance Status Badge and Date */}
            <View style={styles.cardContent}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getColor(item.status) },
                ]}
              >
                {getStatusIcon(item.status)}
                <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.tanggal}>
                <Ionicons name="calendar-outline" size={14} color={Colors.textMedium} />{" "}
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ---
// Styles
// ---

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background, // Use the new background color
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 50, // More padding for status bar
    borderBottomLeftRadius: 30, // More rounded corners
    borderBottomRightRadius: 30,
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
    marginBottom: 10, // Small margin to separate from list
  },
  headerTitle: {
    fontSize: 26, // Larger title
    fontWeight: "bold",
    color: Colors.cardBackground, // White text
    textAlign: "center",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.cardBackground,
    textAlign: "center",
    opacity: 0.9,
  },
  container: {
    padding: 16,
    paddingTop: 10, // Adjust top padding for list content
    paddingBottom: 32,
  },
  card: {
    backgroundColor: Colors.cardBackground, // White card background
    borderRadius: 18, // More rounded cards
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: '#E8E8E8', // Lighter border
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarContainer: {
    width: 55, // Larger avatar
    height: 55,
    borderRadius: 27.5,
    backgroundColor: Colors.primary, // Primary color for avatar background
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: Colors.cardBackground, // White avatar text
    fontSize: 22, // Larger avatar text
    fontWeight: "bold",
  },
  studentInfo: {
    flex: 1,
  },
  nama: {
    fontSize: 19, // Larger name
    fontWeight: "bold",
    color: Colors.textDark, // Dark text
    marginBottom: 4,
  },
  kelas: {
    fontSize: 15, // Slightly larger class text
    color: Colors.textMedium, // Medium grey text
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10, // Add padding between header and content in card
    borderTopWidth: 1, // Add a separator line
    borderColor: '#F0F0F0', // Light separator line
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 25, // More rounded badge
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 6, // Space between icon and text
  },
  tanggal: {
    fontSize: 14,
    color: Colors.textMedium, // Medium grey text
    fontWeight: "500",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    padding: 40,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.primaryDark,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    padding: 40,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
    marginHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 20,
    // Icon color set directly in JSX
  },
  emptyTitle: {
    fontSize: 24, // Larger title
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textMedium,
    textAlign: "center",
    lineHeight: 24,
  },
});