import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme as NavDark, DefaultTheme as NavLight, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';

import i18n, { initLocale, setAppLocale } from '@/i18n';


export type ThemeMode = 'light' | 'dark' | 'system';
interface ThemeCtxValue {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  isDark: boolean;
}
const ThemeCtx = createContext<ThemeCtxValue>({ mode: 'system', setMode: () => {}, isDark: false });
export const useThemeApp = () => useContext(ThemeCtx);


interface LangCtxValue {
  locale: string;
  setLocale: (l: string) => void;
}
const LangCtx = createContext<LangCtxValue>({ locale: 'en', setLocale: () => {} });
export const useLanguage = () => useContext(LangCtx);


export default function RootLayout() {

  const [fontsLoaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') });


  const sys = useColorScheme();


  const [mode, setMode] = useState<ThemeMode>('system');


  const [locale, setLocaleState] = useState<string>('en');


  useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem('theme')) as ThemeMode | null;
      if (saved) setMode(saved);
    })();
  }, []);


  useEffect(() => {
    AsyncStorage.setItem('theme', mode);
  }, [mode]);


  useEffect(() => {
    initLocale().then(() => setLocaleState(i18n.locale));
  }, []);


  const changeLocale = (lc: string) => {
    setLocaleState(lc); 
    setAppLocale(lc); 
  };


  const isDark = mode === 'system' ? sys === 'dark' : mode === 'dark';
  const navTheme = isDark ? NavDark : NavLight;


  if (!fontsLoaded) return <View style={{ flex: 1 }} />; 

  return (
    <LangCtx.Provider value={{ locale, setLocale: changeLocale }}>
      <ThemeCtx.Provider value={{ mode, setMode, isDark }}>
        <ThemeProvider value={navTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </ThemeProvider>
      </ThemeCtx.Provider>
    </LangCtx.Provider>
  );
}
