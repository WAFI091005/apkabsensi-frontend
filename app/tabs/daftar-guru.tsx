import { Ionicons } from '@expo/vector-icons'; // Pastikan ini terinstal: expo install @expo/vector-icons
import { LinearGradient } from 'expo-linear-gradient'; // Pastikan ini terinstal: expo install expo-linear-gradient
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl, // Import Platform for shadows
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "../lib/axiosInstance";

// Define a modern and clean green color palette
const Colors = {
  primaryGreen: '#4CAF50', // Fresh Green for header/accents
  primaryGreenLight: '#8BC34A', // Lighter Green for gradients
  background: '#F0F4F8', // Light blue-grey background (can be adjusted to lighter green if preferred)
  cardBackground: '#FFFFFF', // Pure white for cards
  textDark: '#263238', // Dark charcoal for primary text
  textMedium: '#546E7A', // Muted grey for secondary text
  textLight: '#ECEFF1', // Very light grey for header info
  shadowColor: '#000',
  // Re-using gradients but can be adjusted to green tones too if desired
  avatarGradient1: ['#66BB6A', '#4CAF50'] as const, // Green shades
  avatarGradient2: ['#8BC34A', '#689F38'] as const, // Different green shades
  avatarGradient3: ['#C5E1A5', '#7CB342'] as const, // Lighter green shades
  avatarGradient4: ['#A5D6A7', '#4CAF50'] as const, // More green shades
};

type Guru = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function DaftarGuru() {
  const [data, setData] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGuru = async () => {
    try {
      const res = await axios.get("http://192.168.233.77:8000/api/guru");
      setData(res.data.data || []); // pastikan sesuai format API kamu
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);
      // Optional: show a user-friendly error message
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGuru();
  };

  // Helper function to get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get avatar gradient color
  const getAvatarGradient = (index: number): readonly [string, string] => {
    const gradients = [
      Colors.avatarGradient1,
      Colors.avatarGradient2,
      Colors.avatarGradient3,
      Colors.avatarGradient4,
    ];
    return gradients[index % gradients.length];
  };

  const renderItem = ({ item, index }: { item: Guru, index: number }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <LinearGradient
          colors={getAvatarGradient(index)}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </LinearGradient>
        <View style={styles.infoContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>
            <Ionicons name="mail-outline" size={14} color={Colors.textMedium} /> {item.email}
          </Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color={Colors.textMedium} />
      </View>
    </View>
  );

  // --- Loading State UI ---
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primaryGreen} />
        <Text style={styles.loadingText}>Memuat daftar guru...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Section */}
      <LinearGradient
        colors={[Colors.primaryGreen, Colors.primaryGreenLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          <Ionicons name="people-circle-outline" size={30} color={Colors.cardBackground} /> Daftar Guru
        </Text>
        <Text style={styles.headerSubtitle}>
          Total {data.length} guru terdaftar
        </Text>
      </LinearGradient>

      {/* Empty State */}
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-add-outline" size={72} color={Colors.textMedium} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Tidak Ada Guru Terdaftar</Text>
          <Text style={styles.emptyText}>
            Daftar guru masih kosong. Silakan tambahkan data guru baru.
          </Text>
        </View>
      ) : (
        // List of Teachers
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primaryGreen} // Color of the refresh indicator
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

// ---
// Styles
// ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background, // Set global background
  },
  // Loading and Centered Containers
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  // Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15, // Space below header
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
    color: Colors.cardBackground, // White text
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
  // List Container
  listContainer: {
    paddingHorizontal: 15, // Horizontal padding for the list items
    paddingBottom: 20, // Padding at the bottom of the scroll view
    paddingTop: 5, // Small padding at the top of the list
  },
  // Card Styles
  cardContainer: {
    marginBottom: 12, // Space between cards
  },
  card: {
    backgroundColor: Colors.cardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18, // Internal padding of the card
    borderRadius: 18, // More rounded corners
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, // Softer shadow
        shadowRadius: 8,
      },
      android: {
        elevation: 4, // Android shadow
      },
    }),
    borderWidth: 1,
    borderColor: '#EFEFEF', // Very light border
  },
  avatar: {
    width: 60, // Larger avatar size
    height: 60,
    borderRadius: 30, // Perfectly circular
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2, // Subtle white border on avatar
    borderColor: 'rgba(255,255,255,0.7)',
  },
  avatarText: {
    color: Colors.cardBackground, // White text for initials
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContent: {
    flex: 1, // Takes up remaining space
  },
  name: {
    fontSize: 19, // Larger name font size
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textMedium,
    flexDirection: 'row', // Align icon with text
    alignItems: 'center',
    gap: 5, // Space between icon and email
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'transparent', // Transparent to show SafeAreaView background
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
});