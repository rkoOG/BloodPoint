import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Formulario() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [doouSangue, setDoouSangue] = useState(null);
  const [tomaMedicamento, setTomaMedicamento] = useState(null);
  const [qualMedicamento, setQualMedicamento] = useState("");
  const [teveFebre, setTeveFebre] = useState(null);
  const [contatoDoenca, setContatoDoenca] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    Alert.alert("Formulário submetido!", "Obrigado pelas suas respostas.");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Seta para voltar atrás */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Questionário</Text>
        </View>

        {!submitted ? (
          <View style={styles.section}>
            {/* 1 */}
            <Text style={styles.question}>Já doou sangue anteriormente?</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  doouSangue === true && styles.optionBtnActive,
                ]}
                onPress={() => setDoouSangue(true)}
              >
                <Text
                  style={[
                    styles.optionText,
                    doouSangue === true && styles.optionTextActive,
                  ]}
                >
                  Sim
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  doouSangue === false && styles.optionBtnActive,
                ]}
                onPress={() => setDoouSangue(false)}
              >
                <Text
                  style={[
                    styles.optionText,
                    doouSangue === false && styles.optionTextActive,
                  ]}
                >
                  Não
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2 */}
            <Text style={styles.question}>
              Está atualmente a tomar algum medicamento?
            </Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  tomaMedicamento === true && styles.optionBtnActive,
                ]}
                onPress={() => setTomaMedicamento(true)}
              >
                <Text
                  style={[
                    styles.optionText,
                    tomaMedicamento === true && styles.optionTextActive,
                  ]}
                >
                  Sim
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  tomaMedicamento === false && styles.optionBtnActive,
                ]}
                onPress={() => setTomaMedicamento(false)}
              >
                <Text
                  style={[
                    styles.optionText,
                    tomaMedicamento === false && styles.optionTextActive,
                  ]}
                >
                  Não
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2.1 */}
            {tomaMedicamento === true && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.question}>Qual medicamento?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Indique o medicamento"
                  value={qualMedicamento}
                  onChangeText={setQualMedicamento}
                />
              </View>
            )}

            {/* 3 */}
            <Text style={styles.question}>
              Nas últimas 4 semanas, teve febre, infeções ou sintomas gripais?
            </Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  teveFebre === true && styles.optionBtnActive,
                ]}
                onPress={() => setTeveFebre(true)}
              >
                <Text
                  style={[
                    styles.optionText,
                    teveFebre === true && styles.optionTextActive,
                  ]}
                >
                  Sim
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  teveFebre === false && styles.optionBtnActive,
                ]}
                onPress={() => setTeveFebre(false)}
              >
                <Text
                  style={[
                    styles.optionText,
                    teveFebre === false && styles.optionTextActive,
                  ]}
                >
                  Não
                </Text>
              </TouchableOpacity>
            </View>

            {/* 4 */}
            <Text style={styles.question}>
              Teve contacto recente com alguém com doenças transmissíveis (ex:
              hepatite, COVID-19, HIV)?
            </Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  contatoDoenca === true && styles.optionBtnActive,
                ]}
                onPress={() => setContatoDoenca(true)}
              >
                <Text
                  style={[
                    styles.optionText,
                    contatoDoenca === true && styles.optionTextActive,
                  ]}
                >
                  Sim
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionBtn,
                  contatoDoenca === false && styles.optionBtnActive,
                ]}
                onPress={() => setContatoDoenca(false)}
              >
                <Text
                  style={[
                    styles.optionText,
                    contatoDoenca === false && styles.optionTextActive,
                  ]}
                >
                  Não
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botão Submeter */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submeter</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.question}>
              Obrigado por preencher o formulário!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  backBtn: {
    position: "absolute",
    top: 80,
    left: 16,
    zIndex: 10,
    backgroundColor: "#EF3C3C",
    borderRadius: 20,
    padding: 4,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#EF3C3C",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  section: { marginTop: 16, paddingHorizontal: 16 },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
  },
  optionsRow: { flexDirection: "row", marginBottom: 8 },
  optionBtn: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    borderRadius: 30,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: "center",
  },
  optionBtnActive: {
    backgroundColor: "#c62828",
  },
  optionText: { color: "#333", fontSize: 16 },
  optionTextActive: { color: "#fff", fontWeight: "bold" },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 30,
    backgroundColor: "#c62828",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
