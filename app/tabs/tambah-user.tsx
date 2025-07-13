// import axios from 'axios';
// import React, { useState } from 'react';
// import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

// export default function TambahUser() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [kelas, setKelas] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async () => {
//     if (!name || !email || !password || !kelas) {
//       Alert.alert('Validasi', 'Semua field harus diisi!');
//       return;
//     }

//     try {
//       await axios.post('http://192.168.126.77:8000/api/register', {
//         name,
//         email,
//         password,
//         role: 'siswa',
//         kelas, // ✅ Tambahkan kelas
//       });

//       Alert.alert('Sukses', 'Siswa berhasil didaftarkan!');
//       setName('');
//       setEmail('');
//       setPassword('');
//       setKelas('');
//     } catch (error: any) {
//       console.error(error.response?.data || error);
//       Alert.alert('Gagal', error.response?.data?.message || 'Gagal menambahkan siswa');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Nama:</Text>
//       <TextInput
//         style={styles.input}
//         value={name}
//         onChangeText={setName}
//         placeholder="Nama siswa"
//       />

//       <Text style={styles.label}>Email:</Text>
//       <TextInput
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         placeholder="Email siswa"
//         keyboardType="email-address"
//       />

//       <Text style={styles.label}>Password:</Text>
//       <TextInput
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         placeholder="Password"
//         secureTextEntry
//       />

//       <Text style={styles.label}>Kelas:</Text>
//       <TextInput
//         style={styles.input}
//         value={kelas}
//         onChangeText={setKelas}
//         placeholder="Contoh: XII IPA 1"
//       />

//       <Button title="Tambah Siswa" onPress={handleSubmit} color="#28a745" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     marginTop: 50,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 6,
//     marginTop: 12,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#999',
//     borderRadius: 6,
//     padding: 10,
//     marginBottom: 12,
//   },
// });

import { Ionicons } from '@expo/vector-icons'; // expo install @expo/vector-icons
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient'; // expo install expo-linear-gradient
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ⬇️ picker & storage
import AsyncStorage from '@react-native-async-storage/async-storage'; // expo install @react-native-async-storage/async-storage
import * as DocumentPicker from 'expo-document-picker'; // expo install expo-document-picker

const Colors = {
  primaryGreen: '#4CAF50',
  primaryGreenLight: '#8BC34A',
  background: '#F0F4F8',
  cardBackground: '#FFFFFF',
  textDark: '#263238',
  textMedium: '#546E7A',
  textLight: '#ECEFF1',
  shadowColor: '#000',
  inputBorder: '#D0D6DE',
  inputFocusBorder: '#4CAF50',
  buttonTextLight: '#FFFFFF',
};

export default function TambahUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [kelas, setKelas] = useState('');
  const [nis, setNis] = useState('');
  const [password, setPassword] = useState('');
  const [noHpOrtu, setNoHpOrtu] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // import Excel
  const [importing, setImporting] = useState(false);

  const handleImportExcel = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ],
    });

    // user cancel
    if (res.canceled) return;

    // pastikan ada file
    const asset = res.assets?.[0];
    if (!asset) {
      Alert.alert('Gagal', 'Tidak ada file yang dipilih.');
      return;
    }

    setImporting(true);

    const form = new FormData();
    form.append('file', {
      uri: asset.uri,
      name: asset.name ?? 'siswas.xlsx',
      type: asset.mimeType ?? 'application/octet-stream',
    } as any);

    const token = await AsyncStorage.getItem('token'); // token guru

    try {
      await axios.post(
        'http://192.168.233.77:8000/api/import-siswa',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      Alert.alert('Sukses', 'Import siswa berhasil!');
    } catch (e: any) {
      Alert.alert('Gagal', e.response?.data?.message || 'Import gagal');
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !kelas.trim() || !nis.trim()) {
      Alert.alert('Validasi', 'Nama, Email, Kata Sandi, Kelas, dan NIS harus diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://192.168.233.77:8000/api/register', {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: 'siswa',
        kelas: kelas.trim(),
        nis: nis.trim(),
        no_hp_ortu: noHpOrtu.trim(),
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Sukses', 'Siswa berhasil didaftarkan!');
        setName('');
        setEmail('');
        setPassword('');
        setKelas('');
        setNis('');
        setNoHpOrtu('');
      } else {
        Alert.alert('Gagal', 'Gagal menambahkan siswa. Respon tidak terduga.');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        let msg = '';
        for (const key in error.response.data.errors) {
          msg += `${key}: ${error.response.data.errors[key][0]}\n`;
        }
        Alert.alert('Gagal Validasi', msg.trim());
      } else {
        Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={[Colors.primaryGreen, Colors.primaryGreenLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Ionicons name="person-add-outline" size={36} color={Colors.textLight} />
          <Text style={styles.headerTitle}>Daftar Siswa Baru</Text>
          <Text style={styles.headerSubtitle}>Input data siswa untuk sistem absensi</Text>
        </LinearGradient>

        <View style={styles.formCard}>
          {/* ===== form fields ===== */}
          <Text style={styles.label}>Nama Lengkap Siswa:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Contoh: Siti Nurhaliza"
            placeholderTextColor={Colors.textMedium}
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Alamat Email Siswa:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="contoh@sekolah.sch.id"
            placeholderTextColor={Colors.textMedium}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Kata Sandi:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 8 karakter"
            placeholderTextColor={Colors.textMedium}
            secureTextEntry
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Kelas Siswa:</Text>
          <TextInput
            style={styles.input}
            value={kelas}
            onChangeText={setKelas}
            placeholder="Contoh: XII IPA 1"
            placeholderTextColor={Colors.textMedium}
            autoCapitalize="words"
            editable={!isSubmitting}
          />

          <Text style={styles.label}>NIS Siswa:</Text>
          <TextInput
            style={styles.input}
            value={nis}
            onChangeText={setNis}
            placeholder="Contoh: 110203"
            placeholderTextColor={Colors.textMedium}
            keyboardType="number-pad"
            editable={!isSubmitting}
          />

          <Text style={styles.label}>Nomor HP Orang Tua:</Text>
          <TextInput
            style={styles.input}
            value={noHpOrtu}
            onChangeText={setNoHpOrtu}
            placeholder="Contoh: 6281234567890"
            placeholderTextColor={Colors.textMedium}
            keyboardType="phone-pad"
            editable={!isSubmitting}
          />

          {/* ===== tombol simpan ===== */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.buttonTextLight} />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={22} color={Colors.buttonTextLight} />
                <Text style={styles.submitButtonText}>Daftarkan Siswa</Text>
              </>
            )}
          </TouchableOpacity>

          {/* ===== tombol import Excel ===== */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: Colors.primaryGreenLight }]}
            onPress={handleImportExcel}
            disabled={importing}
            activeOpacity={0.7}
          >
            {importing ? (
              <ActivityIndicator size="small" color={Colors.buttonTextLight} />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={22} color={Colors.buttonTextLight} />
                <Text style={styles.submitButtonText}>Import Excel</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginTop: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 20,
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
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  submitButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primaryGreen,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  submitButtonText: {
    color: Colors.buttonTextLight,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
