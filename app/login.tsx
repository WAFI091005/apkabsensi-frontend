import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image // Import Image biasa
  , // Import Animated
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, // Import TextInput biasa
  TouchableOpacity,
  View
} from 'react-native';

// --- Buat komponen animatable dari komponen standar ---
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animated values for general entrance
  const headerAnim = useState(new Animated.Value(0))[0]; // Opacity & translateY for header block
  const formAnim = useState(new Animated.Value(0))[0];   // Opacity & translateY for form block
  const footerAnim = useState(new Animated.Value(0))[0]; // Opacity for footer

  // Animated values for input focus effect
  const emailBorderAnim = useState(new Animated.Value(0))[0];
  const passwordBorderAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Sequence of animations for staggered appearance
    Animated.sequence([
      // Animate Header (Logo, Title, Subtitle)
      Animated.parallel([
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Animate Form (Input fields, Login Button)
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Animate Footer
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerAnim, formAnim, footerAnim]); // Dependencies for useEffect

  // Functions for input focus animations
  const onFocusInput = (animValue: Animated.Value) => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // Border width needs false for native driver
    }).start();
  };

  const onBlurInput = (animValue: Animated.Value) => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validasi', 'Email dan password harus diisi!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://192.168.233.77:8000/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      console.log('✅ Login berhasil. Token:', token);

      // Fade out and slide down elements before navigating for a smoother exit
      Animated.parallel([
        Animated.timing(headerAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(formAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(footerAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        // Navigate after animation completes
        if (user.role === 'guru') {
          router.replace('/tabs');
        } else {
          router.replace('/(tabs)/profile');
        }
      });

    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message || error);
      const errorMessage = error.response?.data?.message || 'Email atau password salah';
      Alert.alert('Login Gagal', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Interpolate input border color and width
  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e1e8ed', '#3498db'], // Default to focused color
  });
  const emailBorderWidth = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e1e8ed', '#3498db'],
  });
  const passwordBorderWidth = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }],
            },
          ]}
        >
          <AnimatedImage
            source={require('../assets/images/logoMH.jpeg')} // Ganti dengan path logo sekolah Anda
            style={[
              styles.logo,
              { transform: [{ scale: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] },
            ]}
            resizeMode="contain"
          />
          <Text style={styles.title}>Sistem Absensi</Text>
          <Text style={styles.subtitle}>MANBA'UL HIKMAH</Text>
        </Animated.View>

        {/* Animated Form */}
        <Animated.View
          style={[
            styles.form,
            {
              opacity: formAnim,
              transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
            },
          ]}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <AnimatedTextInput // Menggunakan AnimatedTextInput yang sudah dibuat
              placeholder="Masukkan email Anda"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                { borderColor: emailBorderColor, borderWidth: emailBorderWidth },
              ]}
              onFocus={() => onFocusInput(emailBorderAnim)}
              onBlur={() => onBlurInput(emailBorderAnim)}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <AnimatedTextInput // Menggunakan AnimatedTextInput yang sudah dibuat
              placeholder="Masukkan password Anda"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[
                styles.input,
                { borderColor: passwordBorderColor, borderWidth: passwordBorderWidth },
              ]}
              onFocus={() => onFocusInput(passwordBorderAnim)}
              onBlur={() => onBlurInput(passwordBorderAnim)}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.7} // Memberi efek feedback saat ditekan
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Masuk</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Animated Footer */}
        <Animated.View style={[styles.footer, { opacity: footerAnim }]}>
          <Text style={styles.footerText}>© 2024 Sistem Absensi Digital</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa', // Latar belakang lebih terang
  },
  scrollContent: {
    flexGrow: 1, // Penting agar ScrollView bisa membesar jika keyboard muncul
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40, // Tambah padding vertikal agar tidak terlalu mepet
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 34, // Sedikit lebih besar
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18, // Sedikit lebih besar
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 15, // Lebih membulat
    padding: 28, // Padding lebih besar
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, // Shadow lebih dalam
    },
    shadowOpacity: 0.15, // Lebih jelas
    shadowRadius: 10, // Lebih menyebar
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 25, // Spasi lebih besar antar input
  },
  label: {
    fontSize: 17, // Label sedikit lebih besar
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10, // Spasi lebih besar
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10, // Input lebih membulat
    paddingHorizontal: 18, // Padding lebih besar
    paddingVertical: 14, // Padding lebih tinggi
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
  },
  loginButton: {
    backgroundColor: '#3498db', // Biru yang lebih cerah
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center', // Agar ActivityIndicator di tengah
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 19, // Teks tombol lebih besar
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 50, // Spasi lebih besar
  },
  footerText: {
    fontSize: 15, // Teks footer sedikit lebih besar
    color: '#95a5a6',
  },
});