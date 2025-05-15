// src/screens/Perfil.js
import React, { useState } from 'react';
import {SafeAreaView,View,Text,StyleSheet,TouchableOpacity,Modal,Alert,TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* —— USER STATE —— */
const initialUser = {
  name: 'Insira Nome',
  email: 'Insira Email',
  level: 1,
};

const sectionsData = [
  { icon: '💰', text: 'Usar Cupão', route: 'Cupao' },
  { icon: '🌐', text: 'Parceiros', route: 'Parceiros' },
  { icon: '⏳', text: 'Histórico de Doações', route: 'Historico' },
  { icon: '🔳', text: 'Inserir código', route: 'CodigoQr' },
];

export default function Perfil() {
  const navigation = useNavigation();
  const [user, setUser] = useState(initialUser);
  const [selectedTab, setSelectedTab] = useState('Perfil');
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(user);

  /* bottom‑nav handlers */
  const handleSearchPress = () => {
    setSelectedTab('Buscar');
    navigation.navigate('Hospitais');
  };
  const handleHomePress = () => {
    setSelectedTab('Home');
    navigation.navigate('Home');
  };
  const handleProfilePress = () => setSelectedTab('Perfil');

  /* editar perfil */
  const openEdit = () => {
    setForm(user);
    setModalVisible(true);
  };
  const saveEdit = () => {
    setUser(form);
    setModalVisible(false);
  };
  const onChange = (field, value) => setForm({ ...form, [field]: value });

  /* estilo dinâmico nav */
  const iconColor = (tab) => (selectedTab === tab ? '#000' : '#999');
  const textStyle = (tab) => [styles.navItemText, selectedTab === tab && styles.navItemTextActive];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => Alert.alert('Opções', 'Funcionalidade em desenvolvimento.')}
        >
          <Text style={styles.headerIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN */}
      <View style={styles.main}>
        {/* CARD */}
        <View style={styles.profileHeader}>
          <View style={styles.profilePicture}>
            <Text style={styles.initials}>{user.name.trim()[0]?.toUpperCase() || 'A'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profileLevel}>Nível {user.level}</Text>
            <TouchableOpacity onPress={openEdit}>
              <Text style={styles.editButton}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEÇÕES */}
        <View style={styles.sectionsContainer}>
          {sectionsData.map((s) => (
            <TouchableOpacity key={s.text} style={styles.sectionItem} onPress={() => navigation.navigate(s.route)}>
              <Text style={styles.sectionIcon}>{s.icon}</Text>
              <Text style={styles.sectionText}>{s.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleSearchPress}>
          <Ionicons name="search" size={28} color={iconColor('Buscar')} />
          <Text style={textStyle('Buscar')}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
          <Ionicons name="home-outline" size={26} color={iconColor('Home')} />
          <Text style={textStyle('Home')}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfilePress}>
          <Ionicons name="person-outline" size={26} color={iconColor('Perfil')} />
          <Text style={textStyle('Perfil')}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL EDITAR */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduza nome completo"
              placeholderTextColor="#999"
              value={form.name}
              onChangeText={(v) => onChange('name', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Introduza email"
              placeholderTextColor="#999"
              value={form.email}
              onChangeText={(v) => onChange('email', v)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Nível"
              placeholderTextColor="#999"
              value={String(form.level)}
              onChangeText={(v) => onChange('level', v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={saveEdit}>
                <Text>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  main: { flex: 1, paddingHorizontal: 15, paddingTop: 50 },

  /* profile */
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 25,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  initials: { fontSize: 32, color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  profileEmail: { fontSize: 16, color: '#666', marginBottom: 4 },
  profileLevel: { fontSize: 16, color: '#009688', marginBottom: 6 },
  editButton: { fontSize: 16, color: '#00695c', textDecorationLine: 'underline' },

  /* sections */
  sectionsContainer: {},
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionIcon: { fontSize: 22, marginRight: 12 },
  sectionText: { fontSize: 18, color: '#333' },

  /* bottom nav */
  bottomNav: {
    position: 'absolute',
    bottom: 75,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    zIndex: 2,
    elevation: 6,
  },
  navItem: { alignItems: 'center', flex: 1 },
  navItemText: { fontSize: 12, color: '#999' },
  navItemTextActive: { fontSize: 12, color: '#000', fontWeight: 'bold' },

  /* modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
});
