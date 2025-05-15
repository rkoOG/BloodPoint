// src/pages/Historico.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// fallback donations caso não sejam fornecidas via params
const sampleDonations = [
  { id: 1, date: '2025‑01‑12', partner: 'Hospital Santa Maria', amount: '450 ml' },
  { id: 2, date: '2025‑03‑20', partner: 'Hospital São João', amount: '450 ml' },
  { id: 3, date: '2025‑04‑15', partner: 'Instituto Português do Sangue', amount: '450 ml' },
];

export default function Historico() {
  const navigation = useNavigation();
  const route = useRoute();

  // info do utilizador (opcional) vinda do Perfil
  const { user } = route.params || {};

  // histórico (pode vir associado ao utilizador; senão usa sample)
  const donations = user?.donations?.length ? user.donations : sampleDonations;

  const totalDonations = donations.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico</Text>
        <View style={styles.headerButton} />
      </View>

      {/* RESUMO */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Total de doações: {totalDonations}</Text>
      </View>

      {/* LISTA */}
      <ScrollView contentContainerStyle={styles.main}>
        {donations.map((d) => (
          <View key={d.id} style={styles.card}>
            <Text style={styles.cardDate}>{d.date}</Text>
            <Text style={styles.cardPartner}>{d.partner}</Text>
            <Text style={styles.cardAmount}>{d.amount}</Text>
          </View>
        ))}
        {!donations.length && (
          <Text style={styles.empty}>Ainda não existem doações registadas.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------- STYLES ----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

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

  /* resumo */
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 25,
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryText: { fontSize: 20, fontWeight: 'bold', color: '#009688' },

  /* list main */
  main: {
    paddingHorizontal: 25,
    paddingBottom: 80,
  },

  /* donation card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardDate: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  cardPartner: { fontSize: 15, color: '#555', marginBottom: 6 },
  cardAmount: { fontSize: 15, color: '#009688' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});