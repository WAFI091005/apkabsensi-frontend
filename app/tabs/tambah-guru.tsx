// // app/(tabs)/tambah-guru.tsx
// import axios from 'axios';
// import React, { useState } from 'react';
// import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

// export default function TambahGuru() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async () => {
//     if (!name || !email || !password) {
//       Alert.alert('Validasi', 'Semua field harus diisi!');
//       return;
//     }

//     try {
//       await axios.post('http://192.168.126.77:8000/api/register', {
//         name,
//         email,
//         password,
//         role: 'guru', // ⬅️ perhatikan role ini
//       });

//       Alert.alert('Sukses', 'Guru berhasil ditambahkan!');
//       setName('');
//       setEmail('');
//       setPassword('');
//     } catch (error: any) {
//       console.error(error.response?.data || error);
//       Alert.alert('Gagal', 'Gagal menambahkan guru!');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Nama:</Text>
//       <TextInput
//         style={styles.input}
//         value={name}
//         onChangeText={setName}
//         placeholder="Nama guru"
//       />

//       <Text style={styles.label}>Email:</Text>
//       <TextInput
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         placeholder="Email guru"
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

//       <Button title="Tambah Guru" onPress={handleSubmit} color="#007AFF" />
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

// app/(tabs)/tambah-guru.tsx
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
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

// Define a modern and clean color palette
const Colors = {
  primaryGreen: '#4CAF50', // Fresh Green for primary actions
  primaryGreenLight: '#8BC34A', // Lighter Green for gradients
  background: '#F0F4F8', // Light blue-grey background
  cardBackground: '#FFFFFF', // Pure white for cards and inputs
  textDark: '#263238', // Dark charcoal for primary text
  textMedium: '#546E7A', // Muted grey for placeholders and secondary text
  textLight: '#ECEFF1', // Very light grey for header info
  shadowColor: '#000',
  inputBorder: '#D0D6DE', // Soft border for inputs
  inputFocusBorder: '#4CAF50', // Green border on focus
  buttonTextLight: '#FFFFFF', // White text on colored buttons
};

export default function TambahGuru() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Basic client-side validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validasi', 'Semua bidang harus diisi dengan benar!');
      return;
    }

    setIsSubmitting(true); // Disable button and show loading

    try {
      // Send registration request to your API
      const response = await axios.post('http://192.168.233.77:8000/api/register', {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: 'guru', // This is crucial for registering as a teacher
      });

      // Handle successful response
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Sukses', 'Data guru berhasil ditambahkan!');
        // Clear input fields on success
        setName('');
        setEmail('');
        setPassword('');
      } else {
        // Handle unexpected successful statuses, if any
        Alert.alert('Gagal', 'Gagal menambahkan guru. Respon tidak terduga.');
      }
    } catch (error: any) {
      console.error('Error adding teacher:', error.response?.data || error.message || error);
      // More specific error handling based on API response
      if (error.response?.data?.errors?.email) {
        Alert.alert('Gagal', `Email: ${error.response.data.errors.email[0]}`);
      } else if (error.response?.data?.message) {
        Alert.alert('Gagal', error.response.data.message);
      } else {
        Alert.alert('Gagal', 'Terjadi kesalahan saat menambahkan guru. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <LinearGradient
          colors={[Colors.primaryGreen, Colors.primaryGreenLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Ionicons name="person-add-outline" size={36} color={Colors.textLight} />
          <Text style={styles.headerTitle}>Tambah Guru Baru</Text>
          <Text style={styles.headerSubtitle}>Daftarkan akun guru untuk sistem absensi</Text>
        </LinearGradient>

        {/* Form Section */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Nama Lengkap:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Contoh: Budi Santoso"
            placeholderTextColor={Colors.textMedium}
            editable={!isSubmitting} // Disable input while submitting
          />

          <Text style={styles.label}>Alamat Email:</Text>
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

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting} // Disable button while submitting
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.buttonTextLight} />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={22} color={Colors.buttonTextLight} style={styles.buttonIcon} />
                <Text style={styles.submitButtonText}>Tambah Guru</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---
// Styles
// ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingBottom: 30, // Extra space at bottom for scrollability
  },
  header: {
    paddingTop: 60, // More space from top/status bar
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30, // Rounded corners at the bottom
    borderBottomRightRadius: 30,
    alignItems: 'center',
    marginBottom: 25, // Space between header and form card
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 10, // Android shadow
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginTop: 15, // Space between icon and title
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
    borderRadius: 20, // Rounded corners for the form card
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5, // Android shadow
      },
    }),
    borderWidth: 1,
    borderColor: '#EFEFEF', // Very light border
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
    borderRadius: 12, // More rounded input fields
    paddingVertical: 14, // Taller input fields
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 10,
    backgroundColor: '#F9F9F9', // Slightly off-white background for inputs
    // Focus effect can be added via state if needed
  },
  submitButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 16,
    borderRadius: 15, // More rounded button
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25, // More space above button
    flexDirection: 'row', // For icon and text
    ...Platform.select({
      ios: {
        shadowColor: Colors.primaryGreen, // Shadow color matching button
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
    marginLeft: 8, // Space between icon and text
  },
  buttonIcon: {
    marginRight: 8,
  },
});