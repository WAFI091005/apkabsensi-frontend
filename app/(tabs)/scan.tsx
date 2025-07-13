// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import React, { useEffect, useState } from 'react';
// import { Alert, StyleSheet, Text, View } from 'react-native';

// export default function ScanScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scannedData, setScannedData] = useState<string | null>(null);
//   const [isSending, setIsSending] = useState(false);

//   // Ganti ini dengan IP lokal komputer kamu
//   // const SERVER_URL = 'http://192.168.126.77:8000/api/absen';
//   const SERVER_URL = 'http://192.168.126.77:8000/api/absen'; // ✅ sesuai IP kamu


//   useEffect(() => {
//     AsyncStorage.getItem('token').then((token) => {
//       console.log('✅ Token ditemukan:', token);
//     });
//   }, []);

//   if (!permission) {
//     return (
//       <View style={styles.centered}>
//         <Text>Memeriksa izin kamera...</Text>
//       </View>
//     );
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.centered}>
//         <Text>Izin kamera diperlukan</Text>
//         <Text onPress={() => requestPermission()} style={styles.izin}>
//           Izinkan
//         </Text>
//       </View>
//     );
//   }

//   const handleSendToServer = async (data: string) => {
//     try {
//       setIsSending(true);

//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Alert.alert('❌ Gagal', 'Token tidak ditemukan. Silakan login ulang.');
//         return;
//       }

//       let payload;
//       try {
//         payload = JSON.parse(data);
//       } catch (e) {
//         Alert.alert('QR tidak valid', 'Data QR bukan format JSON.');
//         return;
//       }

//       const response = await fetch(SERVER_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const rawText = await response.text();
//       console.log('📥 Raw response:', rawText);

//       let result;
//       try {
//         result = JSON.parse(rawText);
//         console.log('📥 Respon dari server (parsed):', result);
//       } catch (err) {
//         console.log('❌ Gagal parsing JSON:', err.message);
//         Alert.alert('❌ Gagal', 'Respon server tidak valid');
//         return;
//       }

//       if (response.ok) {
//         Alert.alert('✅ Berhasil', result.message || 'Absensi berhasil');
//       } else {
//         Alert.alert('❌ Gagal', result.message || 'Terjadi kesalahan saat absen');
//       }
//     } catch (error) {
//       console.log('❌ Error kirim absen:', error);
//       Alert.alert('❌ Error', 'Gagal terhubung ke server');
//     } finally {
//       setIsSending(false);
//       setTimeout(() => setScannedData(null), 3000);
//     }
//   };

//   return (
//     <CameraView
//       style={StyleSheet.absoluteFillObject}
//       onBarcodeScanned={({ data }) => {
//         if (!isSending && scannedData !== data) {
//           console.log(`📦 Scan: ${data}`);
//           setScannedData(data);
//           handleSendToServer(data);
//         }
//       }}
//       barcodeScannerSettings={{
//         barcodeTypes: ['qr'],
//       }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   izin: {
//     color: 'blue',
//     marginTop: 10,
//     fontWeight: 'bold',
//   },
// });

import { Ionicons } from '@expo/vector-icons'; // Install this if you haven't: expo install @expo/vector-icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient'; // Install this if you haven't: expo install expo-linear-gradient
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define a modern color palette
const Colors = {
  primaryGreen: '#4CAF50', // A calming green for success and main elements
  primaryGreenLight: '#8BC34A', // Lighter green for gradients
  overlayBg: 'rgba(0, 0, 0, 0.6)', // Dark translucent background for overlay
  scanBoxBorder: '#4CAF50', // Green border for the scan box
  scanBoxCorner: '#4CAF50', // Green corners for a subtle effect
  textLight: '#FFFFFF', // White text for elements on dark backgrounds
  textDark: '#263238', // Dark text for information
  statusSuccess: '#4CAF50',
  statusError: '#F44336',
  buttonBg: '#FFFFFF',
  buttonText: '#3F51B5', // A blue for button text
  shadowColor: '#000',
  background: '#F0F4F8', // <--- ADDED THIS LINE to define the background color
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null); // To control message styling

  const SERVER_URL = 'http://192.168.233.77:8000/api/absen';

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      console.log('✅ Token ditemukan:', token ? 'ADA' : 'TIDAK ADA');
    });
  }, []);

  // --- Permission Handling UI ---
  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primaryGreen} />
        <Text style={styles.permissionText}>Memeriksa izin kamera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="camera-outline" size={60} color={Colors.textDark} /> {/* Corrected icon name */}
        <Text style={styles.permissionText}>Akses kamera diperlukan untuk memindai QR Code.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Core Logic: Sending Data to Server ---
  const handleSendToServer = async (data: string) => {
    try {
      setIsSending(true);
      setScanMessage('Memproses data QR...');
      setMessageType(null); // Clear previous message type

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('🚫 Gagal', 'Token tidak ditemukan. Silakan login ulang.');
        setScanMessage('Token tidak ditemukan.');
        setMessageType('error');
        return;
      }

      let payload;
      try {
        payload = JSON.parse(data);
      } catch (e) {
        Alert.alert('QR Tidak Valid', 'Data QR bukan format JSON yang benar.');
        setScanMessage('Data QR tidak valid.');
        setMessageType('error');
        return;
      }

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      console.log('📥 Raw response:', rawText);

      let result;
      try {
        result = JSON.parse(rawText);
        console.log('📥 Respon dari server (parsed):', result);
      } catch (err) {
        console.log('❌ Gagal parsing JSON:', err);
        Alert.alert('❌ Gagal', 'Respon server tidak valid.');
        setScanMessage('Respon server tidak valid.');
        setMessageType('error');
        return;
      }

      if (response.ok) {
        Alert.alert('✅ Berhasil', result.message || 'Absensi berhasil dicatat!');
        setScanMessage(result.message || 'Absensi berhasil!');
        setMessageType('success');
      } else {
        Alert.alert('❌ Gagal', result.message || 'Terjadi kesalahan saat absen.');
        setScanMessage(result.message || 'Absensi gagal.');
        setMessageType('error');
      }
    } catch (error) {
      console.log('❌ Error kirim absen:', error);
      Alert.alert('❌ Error', 'Gagal terhubung ke server. Periksa koneksi Anda.');
      setScanMessage('Gagal terhubung ke server.');
      setMessageType('error');
    } finally {
      setIsSending(false);
      // Reset scannedData and message after a delay to allow rescanning
      setTimeout(() => {
        setScannedData(null);
        setScanMessage(null);
        setMessageType(null);
      }, 3000);
    }
  };

  // --- Main Render Function ---
  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={({ data }) => {
          // Only process new scans if not already sending and data is different
          if (!isSending && scannedData !== data) {
            console.log(`📦 QR Scanned: ${data}`);
            setScannedData(data); // Store scanned data to prevent immediate re-scan of same QR
            handleSendToServer(data);
          }
        }}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {/* Overlay and Scan Box UI */}
      <View style={styles.overlay}>
        <LinearGradient
          colors={['transparent', Colors.overlayBg]}
          style={styles.topGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text style={styles.titleText}>Pindai QR Absensi</Text>
          <Text style={styles.instructionText}>Arahkan kamera ke QR Code absensi</Text>
        </LinearGradient>

        <View style={styles.middleSection}>
          <View style={styles.scanBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <LinearGradient
          colors={[Colors.overlayBg, 'transparent']}
          style={styles.bottomGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          {isSending && (
            <View style={styles.statusBox}>
              <ActivityIndicator size="small" color={Colors.textLight} />
              <Text style={styles.statusText}>Mengirim absensi...</Text>
            </View>
          )}

          {scanMessage && !isSending && (
            <View style={[styles.statusBox, messageType === 'success' ? styles.successBox : styles.errorBox]}>
              <Ionicons
                name={messageType === 'success' ? "checkmark-circle" : "close-circle"}
                size={20}
                color={Colors.textLight}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.statusText}>{scanMessage}</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    </View>
  );
}

// ---
// Styles
// ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Default background for camera area
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background, // Use defined background color from Colors object
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  permissionButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparent overall overlay
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topGradient: {
    width: '100%',
    paddingTop: 80, // More space from top for status bar and title
    paddingBottom: 40,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Subtle text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    opacity: 0.8,
  },
  middleSection: {
    flex: 1, // Takes up remaining space to center scanBox vertically
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 280, // Slightly larger scan box
    height: 280,
    borderWidth: 0, // No main border, corners will define it
    backgroundColor: 'transparent',
    overflow: 'hidden', // Ensures corners stay within bounds
  },
  corner: {
    position: 'absolute',
    width: 40, // Length of each corner piece
    height: 40, // Thickness of each corner piece
    borderColor: Colors.scanBoxCorner,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8, // Rounded corners for the scan box frame
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  bottomGradient: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 60, // More space at the bottom for interaction
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', // Darker background for status
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, // Pill shape
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  statusText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  successBox: {
    backgroundColor: Colors.statusSuccess + 'E0', // Green with transparency
  },
  errorBox: {
    backgroundColor: Colors.statusError + 'E0', // Red with transparency
  },
});