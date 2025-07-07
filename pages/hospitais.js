import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../global/supabaseClient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";

/**
 * Estados de doação permitidos na BD
 */
export const STATUS = {
  PENDENTE: "Pendente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
};

/**
 * Hospitais – pesquisa → escolhe data/hora → grava doação.
 */
export default function Hospitais() {
  const navigation = useNavigation();
  const route = useRoute();
  const passedUser = route.params?.userData || null;
  const insets = useSafeAreaInsets();

  /* ─────────────── STATE ─────────────── */
  const [search, setSearch] = useState("");
  const [allHospitais, setAll] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [slot, setSlot] = useState(null);
  const [pickerVisible, setPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Hospitais"); // footer

  const dismiss = () => Keyboard?.dismiss?.();

  /* ───── FETCH HOSPITAIS ───── */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("hospitais")
        .select("id, name, distrito");
      if (error) {
        console.error(error.message);
        return;
      }

      setAll(data);
      const uniq = [...new Set(data.map((h) => h.distrito?.trim()))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
      setDistritos(uniq);
      setSugestoes(uniq);
    })();
  }, []);

  /* ───── FILTRO PESQUISA ───── */
  useEffect(() => {
    const txt = search.trim().toLowerCase();
    if (!txt) {
      setSugestoes(distritos);
      setFiltered([]);
      setShowSug(true);
      return;
    }
    setSugestoes(distritos.filter((d) => d.toLowerCase().includes(txt)));
    setFiltered(
      allHospitais.filter((h) => h.distrito?.trim().toLowerCase().includes(txt))
    );
    setShowSug(true);
  }, [search, distritos, allHospitais]);

  const pickSugestao = (d) => {
    setSearch(d);
    setFiltered(
      allHospitais.filter(
        (h) => h.distrito?.trim().toLowerCase() === d.toLowerCase()
      )
    );
    setShowSug(false);
    dismiss();
  };

  /* ───── CONFIRMAR ───── */
  const confirmarAgendamento = async () => {
    if (!selected) {
      Alert.alert("Escolhe o hospital");
      return;
    }
    if (!slot) {
      Alert.alert("Escolhe data/hora");
      return;
    }

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Sessão expirada");
      setSaving(false);
      return;
    }

    const code = Math.random().toString(36).slice(-6).toUpperCase();

    const { error } = await supabase.from("doacoes").insert({
      doador_id: user.id,
      hospital_id: selected.id,
      hospital_name: selected.name,
      data_doacao: slot.toISOString(),
      confirm_code: code,
      status: STATUS.PENDENTE, // <── agora compatível com o constraint
    });

    setSaving(false);
    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    Alert.alert(
      "Agendado!",
      `Código ${code}.\nVê em Perfil → Histórico de Doações.`
    );
    navigation.navigate("Perfil", { userData: passedUser });
  };

  /* ───── NAVEGAÇÃO FOOTER ───── */
  const goTo = (screen) => {
    setActiveTab(screen);
    navigation.navigate(screen, { userData: passedUser });
  };

  /* ───── RENDER ───── */
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendar Doação</Text>
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
              setShowSug(true);
            }}
            onFocus={() => {
              setShowSug(true);
              setSugestoes(distritos);
            }}
          />
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => {
              setShowSug(false);
              dismiss();
            }}
          >
            <Ionicons name="search" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {search.trim() !== "" && showSug && sugestoes.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {sugestoes.map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.suggestionItem}
                onPress={() => pickSugestao(d)}
              >
                <Text style={styles.suggestionText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* DATETIME PICKER */}
      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="datetime"
        minuteInterval={5}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setSlot(date);
          setPicker(false);
        }}
        onCancel={() => setPicker(false)}
        locale="pt-PT"
        is24Hour
      />

      {/* CARD AGENDAMENTO */}
      {selected && (
        <View style={styles.inlineModal}>
          <Text style={styles.modalTitle}>{selected.name}</Text>
          <Text style={styles.modalSub}>{selected.distrito}</Text>

          <Text style={styles.modalLabel}>Data & hora escolhidas:</Text>
          <Text style={styles.modalDate}>
            {slot ? slot.toLocaleString("pt-PT") : "—"}
          </Text>

          <TouchableOpacity
            style={styles.agendarBtn}
            onPress={() => setPicker(true)}
          >
            <Text style={styles.btnTxt}>Alterar data/hora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.agendarBtn,
              { backgroundColor: saving ? "#999" : "#4CAF50", marginTop: 12 },
            ]}
            onPress={confirmarAgendamento}
            disabled={saving || !slot}
          >
            <Text style={styles.btnTxt}>
              {saving ? "A gravar…" : "Confirmar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => {
              setSelected(null);
              setSlot(null);
              setPicker(false);
            }}
          >
            <Text style={{ color: "#c62828" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LISTA DE HOSPITAIS */}
      {search.trim() !== "" && (
        <ScrollView contentContainerStyle={styles.section}>
          <Text style={styles.sectionTitle}>Hospitais encontrados</Text>
          {filtered.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum hospital encontrado.</Text>
          ) : (
            filtered.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.localCard}
                onPress={() => {
                  setSelected(item);
                  setPicker(true);
                }}
              >
                <Text style={styles.localText}>{item.name}</Text>
                <Text style={styles.localText}>{item.distrito}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 12 }]}>
        <TouchableOpacity
          onPress={() => goTo("Hospitais")}
          style={[
            styles.footerBtn,
            activeTab === "Hospitais" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="magnify"
            size={28}
            color={activeTab === "Hospitais" ? "#fff" : "#555"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => goTo("Home")}
          style={[
            styles.footerBtn,
            activeTab === "Home" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="home"
            size={28}
            color={activeTab === "Home" ? "#fff" : "#555"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => goTo("Perfil")}
          style={[
            styles.footerBtn,
            activeTab === "Perfil" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="account"
            size={28}
            color={activeTab === "Perfil" ? "#fff" : "#555"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* LAYOUT */
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
  /* SEARCH */
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

  /* LISTA HOSPITAIS */
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
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

  /* MODAL / AGENDAMENTO */
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
  btnTxt: {
    color: "#fff",
    fontWeight: "600",
  },
  modalCancel: {
    marginTop: 18,
    width: "100%",
    alignItems: "center",
  },

  /* FOOTER */
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
});
