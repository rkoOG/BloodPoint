// src/screens/Hospitais.js
import React, { useRef, useState } from 'react';
import {View,Text,StyleSheet,TextInput,FlatList,TouchableOpacity,Dimensions,Image,Linking,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

/* — Dados mock — */
const LOCALS = [
  { id: '1', title: 'CHUC',   image: require('../assets/CHUC.jpg') },
  { id: '2', title: 'Covões', image: require('../assets/covoes.png') },
];

const PERKS = [
  { id: '1', title: 'Desconto 1' },
  { id: '2', title: 'Oferta 2'   },
  { id: '3', title: 'Cupão 3'    },
  { id: '4', title: 'Voucher 4'  },
];

/* URLs Google Maps por hospital */
const MAP_LINKS = {
  CHUC:   'https://maps.app.goo.gl/7Fs3a8Y3GjFRWEnm9',
  Covões: 'https://maps.app.goo.gl/zMMFgRwARAKG8VBr9',
};

export default function Hospitais() {
  const navigation   = useNavigation();
  const localListRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('Buscar');

  /* -------- carrossel -------- */
  const scrollLocals = (dir) => {
    if (!localListRef.current) return;
    const offsetNow = localListRef.current._listRef._scrollMetrics?.offset || 0;
    localListRef.current.scrollToOffset({
      offset: dir === 'left' ? Math.max(0, offsetNow - width * 0.6) : offsetNow + width * 0.6,
      animated: true,
    });
  };

  /* -------- bottom-nav -------- */
  const handleSearchPress  = () => setSelectedTab('Buscar');
  const handleHomePress    = () => { setSelectedTab('Home');   navigation.navigate('Home');   };
  const handleProfilePress = () => { setSelectedTab('Perfil'); navigation.navigate('Perfil'); };

  const iconColor = (tab) => (selectedTab === tab ? '#000' : '#999');
  const textStyle = (tab) => [
    styles.navItemText,
    selectedTab === tab && styles.navItemTextActive,
  ];

  /* ---------------- render ---------------- */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendamento de Doação</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Digite o distrito que procura…"
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
        <Ionicons name="search" size={22} color="#000" style={styles.searchIcon} />
      </View>

      {/* LOCAIS PERTO DE SI */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Locais perto de si</Text>
        <View style={styles.carouselRow}>
          <TouchableOpacity onPress={() => scrollLocals('left')}>
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>

          <FlatList
            ref={localListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={LOCALS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.localCard}
                onPress={() => Linking.openURL(MAP_LINKS[item.title] || '')}
                >
                <Image source={item.image} style={styles.localImg} resizeMode="cover" />
                <Text style={styles.localText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity onPress={() => scrollLocals('right')}>
            <Ionicons name="chevron-forward" size={26} />
          </TouchableOpacity>
        </View>
      </View>

      {/* REGALIAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Algumas Regalias</Text>
        <Text style={styles.sectionSub}>Usufrua de algumas regalias dos nossos parceiros…</Text>

        <FlatList
          horizontal
          data={PERKS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.perkCard}>
              <Text style={styles.perkPhoto}>Foto</Text>
              <Text style={styles.perkText}>{item.title}</Text>
            </View>
          )}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Perks')}>
          <Text style={styles.moreLink}>Veja mais…</Text>
        </TouchableOpacity>
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
    </View>
  );
}

/* --------------------- STYLES --------------------- */
const CARD = width * 0.3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  /* header */
  header: { paddingTop: 50, paddingHorizontal: 16, backgroundColor: '#EF3C3C', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  /* search */
  searchWrapper: { marginTop: 40, alignSelf: 'center' },
  searchInput: {
    width: width * 0.8,
    padding: 14,
    paddingLeft: 24,
    backgroundColor: '#e5e5e5',
    borderRadius: 50,
    fontSize: 15,
  },
  searchIcon: { position: 'absolute', right: 20, top: 14 },

  /* sections */
  section: { marginTop: 32, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionSub: { fontSize: 12, color: '#555', marginBottom: 12 },

  /* carousel */
  carouselRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  localCard: { width: CARD, marginHorizontal: 8, alignItems: 'center' },
  localImg: { width: '100%', height: CARD, borderRadius: 8, backgroundColor: '#d9d9d9' },
  localText: { color: '#666', fontSize: 12, marginTop: 4 },

  /* perks */
  perkCard: { width: CARD * 0.8, marginHorizontal: 6, alignItems: 'center' },
  perkPhoto: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#d9d9d9',
    borderRadius: 4,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#666',
  },
  perkText: { fontSize: 11, textAlign: 'center', marginTop: 4 },
  moreLink: { color: '#007AFF', marginTop: 6, alignSelf: 'flex-end' },

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
  },
  navItem: { alignItems: 'center', flex: 1 },
  navItemText: { fontSize: 12, color: '#999' },
  navItemTextActive: { fontSize: 12, color: '#000', fontWeight: 'bold' },
});
