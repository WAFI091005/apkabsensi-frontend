// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// // Buat instance axios seperti login
// const api = axios.create({
//   baseURL: 'http://192.168.126.77:8000/api',
// });

// export const setAuthToken = (token: string | null) => {
//   if (token) {
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common['Authorization'];
//   }
// };

// export const logout = async () => {
//   const token = await AsyncStorage.getItem('token');
//   if (token) {
//     setAuthToken(token);
//     try {
//       await api.post('/logout');
//     } catch (error) {
//       console.warn('Logout gagal di server, tapi lanjut bersihkan client.');
//     }
//   }

//   // Hapus token & user di local
//   await AsyncStorage.removeItem('token');
//   await AsyncStorage.removeItem('user');
//   setAuthToken(null);
// };

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function logout() {
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('token');
}