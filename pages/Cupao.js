// src/screens/Cupao.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Cupao() {
  const navigation = useNavigation();
  const [code, setCode] = useState("");

  const applyCoupon = () => {
    if (!code.trim()) {
      return Alert.alert("Aviso", "Insere um código válido.");
    }
    // ⚠️ Aqui farás a lógica de validação / request ao backend
    Alert.alert("Sucesso", `Cupão “${code}” aplicado!`);
    setCode("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Usar Cupão</Text>
        {/* placeholder para manter espaçamento simétrico */}
        <View style={styles.headerButton} />
      </View>

      {/* MAIN */}
      <View style={styles.main}>
        <Text style={styles.label}>Introduz o teu código</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: ABCD-1234"
          placeholderTextColor="#999"
          value={code}
          autoCapitalize="characters"
          onChangeText={setCode}
          maxLength={20}
        />

        <TouchableOpacity style={styles.btn} onPress={applyCoupon}>
          <Text style={styles.btnText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---------------------------- STYLES ----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

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

  /* main */
  main: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 80,
    alignItems: "center",
  },
  label: { fontSize: 18, marginBottom: 20, color: "#333" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  btn: {
    width: "100%",
    backgroundColor: "#c62828",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
