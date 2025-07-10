import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../global/supabaseClient";

/**
 * Histórico de doações (React-Native + Supabase)
 * 2025-07-07g
 * • Ajustado aos valores permitidos pelo CHECK:
 *   pendente · iniciada · confirmada · cancelada
 * • Todas as ocorrências de "concluida" → "confirmada"
 * • UI: “Detalhes” texto a vermelho e “Remover” como ✕ a vermelho
 */
export default function Historico() {
  const navigation = useNavigation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [showNurseModal, setShowNurseModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsDonation, setDetailsDonation] = useState(null);

  // Enfermeiros
  const [allNurses, setAllNurses] = useState([]);
  const [filteredNurses, setFilteredNurses] = useState([]);
  const [nurseQuery, setNurseQuery] = useState("");
  const [loadingNurses, setLoadingNurses] = useState(false);

  // ───────────────────── FETCH DONATIONS ───────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("doacoes")
        .select(`id, data_doacao, hospital_name, status, enfermeiros(nome)`)
        .eq("doador_id", user.id)
        .order("data_doacao", { ascending: false });
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setDonations(
        (data || []).map((d) => ({
          id: d.id,
          date: new Date(d.data_doacao).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          partner: d.hospital_name,
          amount: "1 unidade",
          status: d.status,
          nurse: d.enfermeiros?.nome || "—",
        }))
      );
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ────────────── HELPERS ──────────────────────────────────────
  const getOrCreateNurseId = async (name) => {
    let { data: nurse, error } = await supabase
      .from("enfermeiros")
      .select("id")
      .ilike("nome", name)
      .maybeSingle();
    if (error) {
      Alert.alert("Erro", error.message);
      return null;
    }
    if (!nurse) {
      const { data: newNurse, error: err } = await supabase
        .from("enfermeiros")
        .insert({ nome: name.trim() })
        .single();
      if (err) {
        Alert.alert("Erro", err.message);
        return null;
      }
      nurse = newNurse;
    }
    return nurse.id;
  };

  // ────────────── ACTIONS ──────────────────────────────────────
  const openSelectNurseModal = async (donation) => {
    setSelectedDonation(donation);
    setShowNurseModal(true);
    setNurseQuery("");
    setLoadingNurses(true);
    const { data, error } = await supabase
      .from("enfermeiros")
      .select("id,nome")
      .order("nome");
    if (error) {
      Alert.alert("Erro", error.message);
      setLoadingNurses(false);
      return;
    }
    setAllNurses(data || []);
    setFilteredNurses(data || []);
    setLoadingNurses(false);
  };

  const handleSelectNurse = async (nurse) => {
    const nurseId = nurse.id || (await getOrCreateNurseId(nurse.nome));
    if (!nurseId) return;
    const { error } = await supabase
      .from("doacoes")
      .update({ enfermeiro_id: nurseId, status: "iniciada" })
      .eq("id", selectedDonation.id);
    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }
    setDonations((ds) =>
      ds.map((d) =>
        d.id === selectedDonation.id
          ? { ...d, status: "iniciada", nurse: nurse.nome }
          : d
      )
    );
    setShowNurseModal(false);
  };

  const handleFinishDonation = async (donation) => {
    const { error } = await supabase
      .from("doacoes")
      .update({ status: "confirmada" })
      .eq("id", donation.id);
    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }
    setDonations((ds) =>
      ds.map((d) => (d.id === donation.id ? { ...d, status: "confirmada" } : d))
    );
  };

  const handleDeleteDonation = async (donation) => {
    Alert.alert("Eliminar", "Confirma eliminar esta doação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("doacoes")
            .delete()
            .eq("id", donation.id);
          if (error) {
            Alert.alert("Erro", error.message);
            return;
          }
          setDonations((ds) => ds.filter((d) => d.id !== donation.id));
          setShowDetailsModal(false);
        },
      },
    ]);
  };

  // ────────────── RENDERERS ────────────────────────────────────
  const Card = ({ d }) => (
    
    <View style={styles.card}>
      <Text style={styles.cardDate}>{d.date}</Text>
      <Text style={styles.cardPartner}>{d.partner}</Text>
      <Text style={styles.cardAmount}>{d.amount}</Text>
      <Text style={styles.status}>🩸 {d.status}</Text>
      {d.nurse !== "—" && (
        <Text style={styles.nurseLabel}>Enfermeiro: {d.nurse}</Text>
      )}
      <View style={styles.footerRow}>
        {d.status === "iniciada" && (
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => handleFinishDonation(d)}
          >
            <Text style={styles.btnText}>Confirmar</Text>
          </TouchableOpacity>
        )}
        {d.status === "pendente" && (
          <TouchableOpacity
            style={styles.assignBtn}
            onPress={() => openSelectNurseModal(d)}
          >
            <Text style={styles.btnText}>Atribuir</Text>
          </TouchableOpacity>
        )}

        {/* Detalhes – texto vermelho */}
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => {
            setDetailsDonation(d);
            setShowDetailsModal(true);
          }}
        >
          <Text style={styles.detailsBtnText}>Detalhes</Text>
        </TouchableOpacity>

        {/* Remover – ícone “X” vermelho, do lado oposto */}
        <TouchableOpacity
          style={styles.cardRemoveBtn}
          onPress={() => handleDeleteDonation(d)}
        >
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ────────────── UI ───────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico</Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Total: {donations.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#c62828"
            style={{ marginTop: 40 }}
          />
        ) : donations.length ? (
          donations.map((d) => <Card key={d.id} d={d} />)
        ) : (
          <Text style={styles.empty}>
            Ainda não existem doações registadas.
          </Text>
        )}
      </ScrollView>

      {/* Nurse Modal */}
      <Modal visible={showNurseModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <Text style={styles.modalTitle}>Selecionar enfermeiro</Text>
            {loadingNurses ? (
              <ActivityIndicator size="large" color="#c62828" />
            ) : (
              <>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Pesquisar"
                  value={nurseQuery}
                  onChangeText={setNurseQuery}
                />
                {filteredNurses.length ? (
                  <FlatList
                    data={filteredNurses}
                    keyExtractor={(i) => i.id}
                    style={{ marginTop: 10 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.nurseItem}
                        onPress={() => handleSelectNurse(item)}
                      >
                        <Text>{item.nome}</Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleSelectNurse({ nome: nurseQuery })}
                  >
                    <Text style={styles.btnText}>
                      Adicionar "{nurseQuery.trim()}"
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    { backgroundColor: "#eee", marginTop: 15 },
                  ]}
                  onPress={() => setShowNurseModal(false)}
                >
                  <Text>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal visible={showDetailsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <Text style={styles.modalTitle}>Detalhes</Text>
            {detailsDonation && (
              <>
                <Text style={styles.detailLine}>
                  🏥 {detailsDonation.partner}
                </Text>
                <Text style={styles.detailLine}>
                  Qtd.: {detailsDonation.amount}
                </Text>
                <Text style={styles.detailLine}>
                  Estado: {detailsDonation.status}
                </Text>
                <Text style={styles.detailLine}>
                  Enfermeiro: {detailsDonation.nurse}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleDeleteDonation(detailsDonation)}
            >
              <Text style={styles.btnText}>Remover</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: "#eee", marginTop: 10 },
              ]}
              onPress={() => setShowDetailsModal(false)}
            >
              <Text>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  headerButton: { padding: 25 },
  headerIcon: { fontSize: 40 },
  headerTitle: { fontSize: 30, fontWeight: "bold" },

  /* resumo */
  summaryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 25,
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryText: { fontSize: 20, fontWeight: "bold", color: "#c62828" },

  /* list main */
  main: {
    paddingHorizontal: 25,
    paddingBottom: 80,
  },

  /* donation card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  cardPartner: { fontSize: 15, color: "#555", marginBottom: 6 },
  cardAmount: { fontSize: 15, color: "#c62828" },
  status: { marginTop: 6, fontSize: 14, color: "#444" },
  nurseLabel: { marginTop: 4, fontSize: 14, color: "#777" },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },

  /* footer buttons */
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  /* generic buttons */
  assignBtn: {
    backgroundColor: "#c62828",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  finishBtn: {
    backgroundColor: "#2e7d32",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },

  /* Detalhes (texto vermelho) */
  detailsBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c62828",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  detailsBtnText: { color: "#c62828", fontWeight: "bold" },

  /* Remover (ícone ✕ vermelho) */
  cardRemoveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c62828",
    backgroundColor: "#fff",
    marginLeft: 8,
  },
  removeIcon: { color: "#c62828", fontSize: 16, fontWeight: "bold" },

  /* modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContentLarge: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  nurseItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  addBtn: {
    backgroundColor: "#c62828",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalBtn: {
    backgroundColor: "#c62828",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
});
