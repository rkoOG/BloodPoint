import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../global/supabaseClient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PERKS = [
  { id: "1", title: "Desconto 1" },
  { id: "2", title: "Oferta 2" },
  { id: "3", title: "Cupão 3" },
  { id: "4", title: "Voucher 4" },
];

export default function Hospitais() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState("Hospitais");
  const [search, setSearch] = useState("");
  const [allHospitais, setAllHospitais] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [filteredHospitais, setFilteredHospitais] = useState([]);

  useEffect(() => {
    // Buscar hospitais da base de dados
    const fetchHospitais = async () => {
      const { data, error } = await supabase
        .from("hospitais")
        .select("id, name, distrito");
      if (!error && data) {
        setAllHospitais(data);

        // Extrair distritos únicos
        const uniqueDistritos = [
          ...new Set(data.map((h) => h.distrito && h.distrito.trim())),
        ]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        setDistritos(uniqueDistritos);
      }
    };
    fetchHospitais();
  }, []);

  // Atualizar sugestões e hospitais filtrados conforme o texto
  useEffect(() => {
    if (search.trim() === "") {
      setSugestoes(distritos);
      setFilteredHospitais([]); // Não mostra nada
      setShowSugestoes(true);
    } else {
      // Sugestões de distritos
      const filteredSugestoes = distritos.filter((item) =>
        item.toLowerCase().includes(search.trim().toLowerCase())
      );
      setSugestoes(filteredSugestoes);

      // Filtra hospitais apenas pelo distrito
      const filtered = allHospitais.filter(
        (h) =>
          h.distrito &&
          h.distrito.trim().toLowerCase().includes(search.trim().toLowerCase())
      );
      setFilteredHospitais(filtered);
      setShowSugestoes(filteredSugestoes.length > 0);
    }
  }, [search, distritos, allHospitais]);

  // Quando selecionas uma sugestão (distrito)
  const handleSelectSugestao = (sugestao) => {
    setSearch(sugestao);
    const filtered = allHospitais.filter(
      (h) =>
        h.distrito &&
        h.distrito.trim().toLowerCase() === sugestao.trim().toLowerCase()
    );
    setFilteredHospitais(filtered);
    setShowSugestoes(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendamento de Doação</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Digite o distrito do hospital…"
          placeholderTextColor="#666"
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setShowSugestoes(true);
          }}
          onFocus={() => {
            setShowSugestoes(true);
            setSugestoes(distritos);
          }}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: 12 }}
          onPress={() => {
            setShowSugestoes(false);
            Keyboard.dismiss();
          }}
        >
          <Ionicons name="search" size={22} color="#000" />
        </TouchableOpacity>
        {/* SUGESTÕES DE DISTRITO */}
        {search.trim() !== "" && showSugestoes && sugestoes.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {sugestoes.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.suggestionItem}
                onPress={() => handleSelectSugestao(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* LISTA DE HOSPITAIS FILTRADOS (só aparece se search não está vazio) */}
      {search.trim() !== "" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hospitais encontrados</Text>
          <FlatList
            data={filteredHospitais}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
              <Text
                style={{ color: "#666", textAlign: "center", marginTop: 20 }}
              >
                Nenhum hospital encontrado para esse distrito.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.localCard}>
                <Text style={styles.localText}>{item.name}</Text>
                <Text style={styles.localText}>{item.distrito}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* REGALIAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Algumas Regalias</Text>
        <Text style={styles.sectionSub}>
          Usufrua de algumas regalias dos nossos parceiros…
        </Text>

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
        <TouchableOpacity onPress={() => navigation.navigate("Perks")}>
          <Text style={styles.moreLink}>Veja mais…</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER dinâmico */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 12 }]}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab("Hospitais");
            navigation.navigate("Hospitais");
          }}
          style={[
            styles.footerBtn,
            selectedTab === "Hospitais" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="magnify"
            size={28}
            color={selectedTab === "Hospitais" ? "#fff" : "#555"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab("Home");
            navigation.navigate("Home");
          }}
          style={[
            styles.footerBtn,
            selectedTab === "Home" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="home"
            size={30}
            color={selectedTab === "Home" ? "#fff" : "#555"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab("Perfil");
            navigation.navigate("Perfil");
          }}
          style={[
            styles.footerBtn,
            selectedTab === "Perfil" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="account"
            size={28}
            color={selectedTab === "Perfil" ? "#fff" : "#555"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#EF3C3C",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  searchWrapper: { marginTop: 40, alignSelf: "center", width: "80%" },
  searchInput: {
    width: "100%",
    padding: 14,
    paddingLeft: 24,
    backgroundColor: "#e5e5e5",
    borderRadius: 50,
    fontSize: 15,
  },
  searchIcon: { position: "absolute", right: 20, top: 14 },
  suggestionsContainer: {
    position: "absolute",
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    zIndex: 10,
    maxHeight: 180,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: { fontSize: 15, color: "#333" },
  section: { marginTop: 32, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  sectionSub: { fontSize: 12, color: "#555", marginBottom: 12 },
  localCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  localText: { color: "#333", fontSize: 16, marginBottom: 2 },
  perkCard: { width: 90, marginHorizontal: 6, alignItems: "center" },
  perkPhoto: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#d9d9d9",
    borderRadius: 4,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#666",
  },
  perkText: { fontSize: 11, textAlign: "center", marginTop: 4 },
  moreLink: { color: "#007AFF", marginTop: 6, alignSelf: "flex-end" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerBtn: { flex: 1, alignItems: "center", paddingVertical: 10 },
  footerBtnActive: {
    backgroundColor: "#c62828",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  navItem: { alignItems: "center", flex: 1 },
  navItemText: { fontSize: 12, color: "#999" },
  navItemTextActive: { fontSize: 12, color: "#000", fontWeight: "bold" },
});
