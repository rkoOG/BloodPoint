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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import uuid from "react-native-uuid";

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
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [slot, setSlot] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const dismissKeyboard = () => {
    if (Keyboard?.dismiss) Keyboard.dismiss();
  };

  useEffect(() => {
    const fetchHospitais = async () => {
      const { data, error } = await supabase
        .from("hospitais")
        .select("id, name, distrito");

      if (error) {
        console.error("Erro a buscar hospitais:", error.message);
        return;
      }

      setAllHospitais(data);

      const uniq = [
        ...new Set(data.map((h) => h.distrito && h.distrito.trim())),
      ]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
      setDistritos(uniq);
    };

    fetchHospitais();
  }, []);

  useEffect(() => {
    const text = search.trim().toLowerCase();

    if (!text) {
      setSugestoes(distritos);
      setFilteredHospitais([]);
      setShowSugestoes(true);
    } else {
      const sug = distritos.filter((d) => d.toLowerCase().includes(text));
      setSugestoes(sug);

      setFilteredHospitais(
        allHospitais.filter(
          (h) => h.distrito && h.distrito.trim().toLowerCase().includes(text)
        )
      );

      setShowSugestoes(sug.length > 0);
    }
  }, [search, distritos, allHospitais]);

  const handleSelectSugestao = (d) => {
    setSearch(d);
    setFilteredHospitais(
      allHospitais.filter(
        (h) => h.distrito && h.distrito.trim().toLowerCase() === d.toLowerCase()
      )
    );
    setShowSugestoes(false);
    dismissKeyboard();
  };

  const confirmarAgendamento = async () => {
    if (!selectedHospital || !slot) return;
    setSaving(true);

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr) {
      alert("Não foi possível obter utilizador autenticado");
      setSaving(false);
      return;
    }

    const confirmCode = Math.floor(100000 + Math.random() * 900000).toString();

    const { error } = await supabase.from("doacoes").insert({
      id: uuid.v4(),
      doador_id: user.id,
      enfermeiro_id: null,
      hospital_id: selectedHospital.id,
      data_doacao: slot.toISOString(),
      confirm_code: confirmCode,
    });

    setSaving(false);

    if (error) {
      alert("Erro ao gravar agendamento: " + error.message);
      return;
    }

    alert(
      `Doação marcada para ${slot.toLocaleString()} — código: ${confirmCode}`
    );
    cancelarAgendamento();
  };

  const cancelarAgendamento = () => {
    setSelectedHospital(null);
    setSlot(null);
    setPickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendamento de Doação</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite o distrito do hospital…"
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={search}
            onChangeText={(t) => {
              setSearch(t);
              setShowSugestoes(true);
            }}
            onFocus={() => {
              setShowSugestoes(true);
              setSugestoes(distritos);
            }}
          />
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => {
              setShowSugestoes(false);
              dismissKeyboard();
            }}
          >
            <Ionicons name="search" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* SUGESTÕES */}
        {search.trim() !== "" && showSugestoes && sugestoes.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {sugestoes.map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.suggestionItem}
                onPress={() => handleSelectSugestao(d)}
              >
                <Text style={styles.suggestionText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* DATE TIME PICKER MODAL */}
      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="datetime"
        minuteInterval={5}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setSlot(date);
          setPickerVisible(false);
        }}
        onCancel={() => setPickerVisible(false)}
        locale="pt-PT"
        is24Hour
      />

      {/* LISTA DE HOSPITAIS */}
      {search.trim() !== "" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hospitais encontrados</Text>
          <FlatList
            data={filteredHospitais}
            keyExtractor={(i) => String(i.id)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum hospital encontrado.</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.localCard}
                onPress={() => {
                  setSelectedHospital(item);
                  setSlot(new Date());
                }}
              >
                <Text style={styles.localText}>{item.name}</Text>
                <Text style={styles.localText}>{item.distrito}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {selectedHospital && (
        <View style={styles.inlineModal}>
          <Text style={styles.modalTitle}>{selectedHospital.name}</Text>
          <Text style={styles.modalSub}>{selectedHospital.distrito}</Text>
          <Text style={styles.modalLabel}>Data &amp; hora escolhidas:</Text>
          <Text style={styles.modalDate}>
            {slot ? slot.toLocaleString() : "—"}
          </Text>
          <TouchableOpacity
            style={styles.agendarBtn}
            onPress={() => setPickerVisible(true)}
          >
            <Text style={{ color: "#fff" }}>Escolher data e hora</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.agendarBtn,
              {
                backgroundColor: saving ? "#999" : "#4CAF50",
                marginTop: 12,
              },
            ]}
            onPress={confirmarAgendamento}
            disabled={saving || !slot}
          >
            <Text style={{ color: "#fff" }}>
              {saving ? "A gravar…" : "Confirmar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={cancelarAgendamento}
          >
            <Text style={{ color: "#c62828" }}>Cancelar / Fechar</Text>
          </TouchableOpacity>
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
          keyExtractor={(i) => i.id}
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

      {/* FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 12 }]}>
        <TouchableOpacity
          style={[
            styles.footerBtn,
            selectedTab === "Hospitais" && styles.footerBtnActive,
          ]}
          onPress={() => {
            setSelectedTab("Hospitais");
            navigation.navigate("Hospitais");
          }}
        >
          <Icon
            name="magnify"
            size={28}
            color={selectedTab === "Hospitais" ? "#fff" : "#555"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerBtn,
            selectedTab === "Home" && styles.footerBtnActive,
          ]}
          onPress={() => {
            setSelectedTab("Home");
            navigation.navigate("Home");
          }}
        >
          <Icon
            name="home"
            size={30}
            color={selectedTab === "Home" ? "#fff" : "#555"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerBtn,
            selectedTab === "Perfil" && styles.footerBtnActive,
          ]}
          onPress={() => {
            setSelectedTab("Perfil");
            navigation.navigate("Perfil");
          }}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#EF3C3C",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchWrapper: {
    marginTop: 40,
    alignSelf: "center",
    width: "80%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    borderRadius: 50,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 14,
    fontSize: 15,
    backgroundColor: "transparent",
  },
  searchIcon: {
    padding: 6,
    marginLeft: 4,
  },
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
  suggestionText: {
    fontSize: 15,
    color: "#333",
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionSub: {
    fontSize: 12,
    color: "#555",
    marginBottom: 12,
  },
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
  localText: {
    color: "#333",
    fontSize: 16,
    marginBottom: 2,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  perkCard: {
    width: 90,
    marginHorizontal: 6,
    alignItems: "center",
  },
  perkPhoto: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#d9d9d9",
    borderRadius: 4,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#666",
  },
  perkText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  moreLink: {
    color: "#007AFF",
    marginTop: 6,
    alignSelf: "flex-end",
  },
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
  footerBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  footerBtnActive: {
    backgroundColor: "#c62828",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  modal: {
    width: "90%", // aumenta a largura
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 28, // mais espaço vertical
    paddingHorizontal: 18, // mais espaço horizontal
    alignItems: "center",
    justifyContent: "center",
  },
  inlineModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#c62828",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#c62828",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#c62828",
    marginBottom: 8,
    textAlign: "center",
    width: "100%",
  },
  modalSub: {
    color: "#c62828",
    fontWeight: "600",
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
  },
  modalLabel: {
    color: "#c62828",
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  modalDate: {
    marginBottom: 16,
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  agendarBtn: {
    backgroundColor: "#c62828",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  modalCancel: {
    marginTop: 18,
    width: "100%",
    alignItems: "center",
  },
});
