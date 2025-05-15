// src/pages/Parceiros.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const partners = [
  { name: 'Cruz Vermelha', url: 'https://cruzvermelha.pt', emoji: '🩸' },
  { name: 'Unilabs', url: 'https://unilabs.pt', emoji: '🏥' },
  { name: 'Banco Alimentar', url: 'https://bancoalimentar.pt', emoji: '🍞' },
];

export default function Parceiros() {
  const navigation = useNavigation();

  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu um erro ao abrir o link.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parceiros</Text>
        {/* placeholder para simetria */}
        <View style={styles.headerButton} />
      </View>

      {/* LISTA DE PARCEIROS */}
      <ScrollView contentContainerStyle={styles.main}>
        {partners.map((p) => (
          <TouchableOpacity key={p.name} style={styles.card} onPress={() => openLink(p.url)}>
            <Text style={styles.cardEmoji}>{p.emoji}</Text>
            <Text style={styles.cardText}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------- STYLES ----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  headerButton: { padding: 25 },
  headerIcon: { fontSize: 40 },
  headerTitle: { fontSize: 30, fontWeight: 'bold' },

  /* main */
  main: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 80 },

  /* partner card */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardEmoji: { fontSize: 26, marginRight: 14 },
  cardText: { fontSize: 18, color: '#333' },
});
