import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import i18n from '@/i18n';
import { useLanguage } from '../_layout';

const { width } = Dimensions.get("window");

const Colors = {
  primary: "#4CAF50",
  primaryLight: "#8BC34A",
  accent: "#FFC107",
  background: "#F5F7FA",
  cardBackground: "#FFFFFF",
  textDark: "#263238",
  textMedium: "#546E7A",
  textLight: "#ECEFF1",
  danger: "#EF5350",
  shadowColor: "#000",
};

interface Siswa {
  id: number;
  nama: string;
  kelas: string;
  created_at: string;
  updated_at: string;
}

interface Absensi {
  id: number;
  siswa_id: number;
  status: string;
  tanggal: string;
  [key: string]: any;
}

interface StatsState {
  totalSiswa: number;
  kehadiran: number;
  totalKelas: number;
  loading: boolean;
}

export default function HomeGuru() {
  const router = useRouter();
  const { locale } = useLanguage(); 
  const [userName, setUserName] = useState("Guru");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<StatsState>({
    totalSiswa: 0,
    kehadiran: 0,
    totalKelas: 0,
    loading: true,
  });

  const fetchStats = async () => {
    setStats((prev) => ({ ...prev, loading: true }));
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const siswaResponse = await fetch("http://192.168.233.77:8000/api/siswa", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (siswaResponse.ok) {
        const siswas: Siswa[] = await siswaResponse.json();
        
        const totalSiswa = siswas.length;
        const kelasNormalized = siswas.map((siswa: Siswa) =>
          siswa.kelas.toLowerCase().trim()
        );
        const uniqueKelas = [...new Set(kelasNormalized)];
        const totalKelas = uniqueKelas.length;

        let kehadiranPercentage = 0;

        if (totalSiswa > 0) {
          try {
            const absensiResponse = await fetch(`http://192.168.233.77:8000/api/kehadiran/hari-ini`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (absensiResponse.ok) {
              const absensiData = await absensiResponse.json();
              const absensiList: Absensi[] = absensiData.data || [];

              const hadir = absensiList.filter(
                (absen: Absensi) =>
                  absen.status === "hadir" ||
                  absen.status === "H" ||
                  absen.status === "present"
              ).length;

              kehadiranPercentage = Math.round((hadir / totalSiswa) * 100);

            } else {
              console.warn(`Absensi endpoint returned status ${absensiResponse.status}. Asumsi 0% kehadiran.`);
              kehadiranPercentage = 0;
              Alert.alert(i18n.t('info'), i18n.t('failed_to_load_today_attendance'));
            }
          } catch (absensiError) {
            console.error("Error fetching absensi data. Asumsi 0% kehadiran:", absensiError);
            kehadiranPercentage = 0;
            Alert.alert(i18n.t('error'), i18n.t('failed_to_connect_attendance_data'));
          }
        }

        setStats({
          totalSiswa: totalSiswa,
          kehadiran: kehadiranPercentage,
          totalKelas: totalKelas,
          loading: false,
        });

      } else {
        throw new Error("Failed to fetch siswas data");
      }
    } catch (error: any) {
      console.error("Error fetching general stats and siswa data:", error);
      setStats({
        totalSiswa: 0,
        kehadiran: 0,
        totalKelas: 0,
        loading: false,
      });
      if (error.message === "Failed to fetch siswas data") {
        Alert.alert(i18n.t('error'), i18n.t('failed_to_load_main_data'));
      } else if (!String(error).includes("Absensi endpoint returned status") && !String(error).includes("Error fetching absensi data")) {
          Alert.alert(i18n.t('error'), i18n.t('unexpected_error_loading_data'));
      }
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.nama || user.name || i18n.t('teacher_name_fallback'));
        }
      } catch (err) {
        console.log("Error getting user data:", err);
      }
    };

    getUserData();
    fetchStats();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const statsTimer = setInterval(() => {
      fetchStats();
    }, 300000);

    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, [locale]);


  const handleLogout = async () => {
    Alert.alert(
      i18n.t("confirm_logout_title"),
      i18n.t("confirm_logout_message"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("logout_button"),
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              router.replace("/login");
            } catch (err) {
              Alert.alert(i18n.t("error"), i18n.t("failed_to_logout"));
            }
          },
        },
      ]
    );
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return i18n.t("morning_greeting");
    if (hour >= 12 && hour < 15) return i18n.t("afternoon_greeting");
    if (hour >= 15 && hour < 18) return i18n.t("evening_greeting");
    return i18n.t("night_greeting");
  };

  const menuItems = useMemo(() => [
    {
      title: i18n.t("student_data"),
      subtitle: i18n.t("manage_student_info"),
      icon: "person-outline",
      color: Colors.primary,
      onPress: () => router.push("/data-siswa" as any),
    },
    {
      title: i18n.t("absentee"),
      subtitle: i18n.t("view_record_attendance"),
      icon: "clipboard-outline",
      color: "#2196F3",
      onPress: () => router.push("/tabs/absen" as any),
    },
    {
      title: i18n.t("reports"),
      subtitle: i18n.t("attendance_analysis_reports"),
      icon: "bar-chart-outline",
      color: "#FF9800",
      onPress: () => router.push("/laporan" as any),
    },
    {
      title: i18n.t("app_settings"),
      subtitle: i18n.t("manage_app_preferences"),
      icon: "settings-outline",
      color: "#9C27B0",
      onPress: () => router.push("/settings" as any),
    },
  ], [locale]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{userName}!</Text>
            <Text style={styles.date}>
              {currentTime.toLocaleDateString(locale, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={24} color={Colors.primary} style={styles.statCardIcon} />
          <Text style={stats.loading ? styles.statLoadingText : styles.statNumber}>
            {stats.loading ? i18n.t('loading') : stats.totalSiswa}
          </Text>
          <Text style={styles.statLabel}>{i18n.t('total_students')}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color={Colors.primary} style={styles.statCardIcon} />
          <Text style={stats.loading ? styles.statLoadingText : styles.statNumber}>
            {stats.loading ? i18n.t('loading') : `${stats.kehadiran}%`}
          </Text>
          <Text style={styles.statLabel}>{i18n.t('attendance')}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="school-outline" size={24} color={Colors.primary} style={styles.statCardIcon} />
          <Text style={stats.loading ? styles.statLoadingText : styles.statNumber}>
            {stats.loading ? i18n.t('loading') : stats.totalKelas}
          </Text>
          <Text style={styles.statLabel}>{i18n.t('total_classes')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{i18n.t('main_menu')}</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: item.color + '1A' }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={Colors.textMedium} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{i18n.t('quick_actions')}</Text>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/tabs/input-absen" as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={30} color={Colors.primary} />
            <Text style={styles.actionText}>{i18n.t('input_attendance')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/scan-qr" as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code-outline" size={30} color={Colors.primary} />
            <Text style={styles.actionText}>{i18n.t('scan_qr')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchStats}
          disabled={stats.loading}
          activeOpacity={0.7}
        >
          {stats.loading ? (
            <ActivityIndicator color={Colors.primary} size="small" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons name="refresh-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          )}
          <Text style={styles.refreshText}>
            {stats.loading ? i18n.t("loading_data") : i18n.t("refresh_data")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>{i18n.t('sign_out_of_account')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: -50,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 5,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  greetingContainer: {
    flex: 1,
    paddingTop: 5,
  },
  greeting: {
    fontSize: 18,
    color: Colors.textLight,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.cardBackground,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "space-between",
    zIndex: 1,
  },
  statCard: {
    backgroundColor: Colors.cardBackground,
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        // Periksa apakah ini menyebabkan masalah dan sesuaikan
        shadowOpacity: 0.1, 
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
    borderBottomWidth: 3,
    borderBottomColor: Colors.accent + '80',
  },
  statCardIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: 4,
  },
  statLoadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textMedium,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textMedium,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: 16,
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    backgroundColor: Colors.cardBackground,
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
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
  },
  menuIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textDark,
    marginBottom: 3,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.textMedium,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 15,
  },
  actionButton: {
    backgroundColor: Colors.cardBackground,
    flex: 1,
    alignItems: "center",
    paddingVertical: 25,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textDark,
    marginTop: 8,
  },
  refreshSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  refreshButton: {
    backgroundColor: Colors.cardBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.primary + 'B3',
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
  refreshText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: Colors.cardBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.danger,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.danger,
  },
});