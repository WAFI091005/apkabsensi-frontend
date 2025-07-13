// app/help.tsx
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    UIManager,
    View,
} from 'react-native';

import i18n from '@/i18n'; // Pastikan path ini benar
import { useLanguage } from './_layout'; // Untuk konsistensi bahasa

// Aktifkan LayoutAnimation untuk Android (diperlukan)
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Colors definition (idealnya ini di file terpisah dan diimpor) ---
const Colors = {
  primaryGreen: '#4CAF50',
  primaryGreenLight: '#8BC34A',
  background: '#F0F4F8',
  cardBackground: '#FFFFFF',
  textDark: '#263238',
  textMedium: '#546E7A',
  textLight: '#ECEFF1',
  accentColor: '#4CAF50',
  dangerColor: '#E74C3C',
  borderColor: '#EFEFEF',
  shadowColor: '#000',

  avatarGradient1: ['#66BB6A', '#4CAF50'] as const,
  avatarGradient2: ['#8BC34A', '#689F38'] as const,
};
// ------------------------------------------------------------------

type FAQItem = {
  questionKey: string;
  answerKey: string;
};

// Data FAQ
const faqData: FAQItem[] = [
  {
    questionKey: 'faq_q1_question',
    answerKey: 'faq_q1_answer',
  },
  {
    questionKey: 'faq_q2_question',
    answerKey: 'faq_q2_answer',
  },
  {
    questionKey: 'faq_q3_question',
    answerKey: 'faq_q3_answer',
  },
  {
    questionKey: 'faq_q4_question',
    answerKey: 'faq_q4_answer',
  },
  {
    questionKey: 'faq_q5_question',
    answerKey: 'faq_q5_answer',
  },
];

// Komponen untuk setiap item FAQ yang dapat diperluas
const FAQAccordionItem = ({ questionKey, answerKey }: FAQItem) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.faqItem}>
      <Pressable style={styles.faqQuestionContainer} onPress={toggleExpand}>
        <Text style={styles.faqQuestionText}>{i18n.t(questionKey)}</Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.accentColor}
        />
      </Pressable>
      {expanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswerText}>{i18n.t(answerKey)}</Text>
        </View>
      )}
    </View>
  );
};

export default function HelpAndFAQ() {
  const { locale } = useLanguage(); // Gunakan locale jika ada teks yang perlu diperbarui secara dinamis

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: i18n.t('help_faq'), // Menggunakan terjemahan dari i18n
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.textDark,
          headerShadowVisible: false,
        }}
      />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.card}>
        <Text style={styles.mainTitle}>{i18n.t('faq_title') || "Pertanyaan yang Sering Diajukan"}</Text>
        <Text style={styles.description}>
          {i18n.t('faq_description') || "Temukan jawaban untuk pertanyaan umum tentang penggunaan aplikasi kami di sini."}
        </Text>

        {faqData.map((item, index) => (
          <FAQAccordionItem key={index.toString()} {...item} />
        ))}

        <Text style={styles.contactSectionTitle}>{i18n.t('need_more_help') || "Butuh Bantuan Lebih Lanjut?"}</Text>
        <Text style={styles.contactText}>
          {i18n.t('contact_us_long_desc') || "Jika Anda tidak menemukan jawaban atas pertanyaan Anda, jangan ragu untuk menghubungi tim dukungan kami."}
          {'\n'}
          Email: support@aplikasianda.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
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
    borderColor: Colors.borderColor,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  faqItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingBottom: 10,
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginRight: 10,
  },
  faqAnswerContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.textMedium,
    lineHeight: 20,
  },
  contactSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryGreen,
    marginTop: 30,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 10,
  },
});