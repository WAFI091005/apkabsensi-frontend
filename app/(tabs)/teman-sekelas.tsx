// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LinearGradient } from 'expo-linear-gradient';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';

// const { width } = Dimensions.get('window');

// export default function TemanSekelasScreen() {
//   const [teman, setTeman] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTemanSekelas = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const res = await fetch('http://192.168.126.77:8000/api/teman-sekelas', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       });

//       if (!res.ok) {
//         console.error('Token salah atau akses ditolak:', res.status);
//         return;
//       }

//       const data = await res.json();
//       setTeman(data);
//     } catch (err) {
//       console.error('Gagal ambil data teman sekelas', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTemanSekelas();
//   }, []);

//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(word => word.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const getAvatarColor = (index: number): [string, string] => {
//     const colors: [string, string][] = [
//       ['#667eea', '#764ba2'],
//       ['#f093fb', '#f5576c'],
//       ['#4facfe', '#00f2fe'],
//       ['#43e97b', '#38f9d7'],
//       ['#fa709a', '#fee140'],
//       ['#a8edea', '#fed6e3'],
//       ['#ff9a9e', '#fecfef'],
//       ['#ffecd2', '#fcb69f'],
//     ];
//     return colors[index % colors.length];
//   };

//   if (loading) {
//     return (
//       <LinearGradient colors={['#667eea', '#764ba2']} style={styles.loadingContainer}>
//         <View style={styles.loadingCard}>
//           <ActivityIndicator size="large" color="#667eea" />
//           <Text style={styles.loadingText}>Memuat teman sekelas...</Text>
//         </View>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>👥 Teman Sekelas</Text>
//         <Text style={styles.subtitle}>{teman.length} teman ditemukan</Text>
//       </View>

//       {teman.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyIcon}>🤝</Text>
//           <Text style={styles.emptyTitle}>Belum Ada Teman</Text>
//           <Text style={styles.emptyText}>
//             Belum ada teman sekelas lainnya yang terdaftar
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={teman}
//           keyExtractor={(item) => item.id.toString()}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContainer}
//           renderItem={({ item, index }) => (
//             <View style={styles.cardContainer}>
//               <LinearGradient colors={['#ffffff', '#f8f9fa']} style={styles.card}>
//                 <LinearGradient colors={getAvatarColor(index)} style={styles.avatar}>
//                   <Text style={styles.avatarText}>{getInitials(item.nama)}</Text>
//                 </LinearGradient>

//                 <View style={styles.cardContent}>
//                   <Text style={styles.name}>{item.nama}</Text>
//                   <Text style={styles.email}>{item.user?.email}</Text>
//                 </View>

//                 <View style={styles.statusDot} />
//               </LinearGradient>
//             </View>
//           )}
//         />
//       )}
//     </LinearGradient>
//   );
// }

// // ⬇️ (styles tetap sama seperti versi kamu sebelumnya)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     padding: 30,
//     borderRadius: 20,
//     alignItems: 'center',
//     elevation: 8,
//   },
//   loadingText: {
//     marginTop: 15,
//     fontSize: 16,
//     color: '#667eea',
//     fontWeight: '600',
//   },
//   header: {
//     paddingTop: 60,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#2d3436',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#636e72',
//     fontWeight: '500',
//   },
//   listContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   cardContainer: {
//     marginBottom: 15,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 16,
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.8)',
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   avatarText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cardContent: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2d3436',
//     marginBottom: 4,
//   },
//   email: {
//     fontSize: 14,
//     color: '#636e72',
//     fontWeight: '500',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#00b894',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyIcon: {
//     fontSize: 64,
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2d3436',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#636e72',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
// });

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const Colors = {
  backgroundLight: '#F0F4F8',
  backgroundDark: '#E6ECF2',
  primaryGreen: '#4CAF50',
  primaryDarkGreen: '#388E3C',
  textDark: '#2C3E50',
  textMedium: '#7F8C8D',
  white: '#FFFFFF',
  shadowColor: '#000',
  onlineDot: '#2ECC71',
};

export default function TemanSekelasScreen() {
  const [teman, setTeman] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemanSekelas = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token is missing.');
        return;
      }

      const res = await fetch('http://192.168.233.77:8000/api/teman-sekelas', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          console.error('Auth error:', res.status);
        } else {
          console.error('Fetch failed:', res.status);
        }
        setTeman([]);
        return;
      }

      const data = await res.json();
      setTeman(data);
    } catch (err) {
      console.error('Error:', err);
      setTeman([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemanSekelas();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number): [string, string] => {
    const colors: [string, string][] = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
      ['#a8edea', '#fed6e3'],
      ['#ff9a9e', '#fecfef'],
      ['#ffecd2', '#fcb69f'],
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <LinearGradient colors={[Colors.primaryGreen, Colors.primaryDarkGreen]} style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={Colors.primaryGreen} />
          <Text style={styles.loadingText}>Memuat teman sekelas...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[Colors.backgroundLight, Colors.backgroundDark]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="people-outline" size={30} color={Colors.textDark} />
          <Text style={styles.title}>Teman Sekelas</Text>
        </View>
        <Text style={styles.subtitle}>{teman.length} teman ditemukan</Text>
      </View>

      {teman.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-circle-outline" size={80} color={Colors.textMedium} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Belum Ada Teman</Text>
          <Text style={styles.emptyText}>
            Belum ada teman sekelas lainnya yang terdaftar di sistem.
          </Text>
        </View>
      ) : (
        <FlatList
          data={teman}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <LinearGradient colors={getAvatarColor(index)} style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(item.nama)}</Text>
                </LinearGradient>

                <View style={styles.cardContent}>
                  <Text style={styles.name}>{item.nama}</Text>
                  <View style={styles.emailRow}>
                    <Ionicons name="mail-outline" size={14} color={Colors.textMedium} />
                    <Text style={styles.email}>{item.user?.email || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.statusDot} />
              </View>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: Colors.white,
    padding: 40,
    borderRadius: 20,
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
    marginTop: 20,
    fontSize: 18,
    color: Colors.primaryGreen,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 30,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 4,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  email: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.onlineDot,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: Colors.backgroundLight,
  },
  emptyIcon: {
    marginBottom: 25,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },
});
