// src/pages/RegisterScreen.js
import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Checkbox,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper";
import Colors from "../constants/colors";
import { supabase } from "../global/supabaseClient";

export default function RegisterScreen({ navigation }) {
  /* ─────────────  STATE  ───────────── */
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  /* ─────────────  HELPERS  ───────────── */
  function showMessage(msg) {
    setSnackbarMsg(msg);
    setSnackbarVisible(true);
  }

  /* ─────────────  REGISTER  ───────────── */
  async function handleRegister() {
    /* validações rápidas */
    if (attemptCount >= 20) {
      showMessage(
        "Limite de tentativas atingido. Por favor, tente mais tarde."
      );
      return;
    }
    if (!nome || !email || !password || !confirmPassword) {
      showMessage("Preencha todos os campos.");
      setAttemptCount((p) => p + 1);
      return;
    }
    if (password !== confirmPassword) {
      showMessage("As senhas não coincidem.");
      setAttemptCount((p) => p + 1);
      return;
    }
    if (!isChecked) {
      showMessage("É necessário aceitar os Termos e Condições.");
      setAttemptCount((p) => p + 1);
      return;
    }

    setLoading(true);

    try {
      /* 1) Criar utilizador no Supabase Auth */
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        showMessage("Erro ao criar conta: " + error.message);
        setAttemptCount((p) => p + 1);
        return;
      }

      const authUser = data.user;
      if (!authUser) {
        showMessage("Erro: utilizador não encontrado.");
        setAttemptCount((p) => p + 1);
        return;
      }

      /* 2) Guardar (ou actualizar) perfil na tabela 'utilizadores' */
      const { error: upsertErr } = await supabase.from("utilizadores").upsert(
        {
          id: authUser.id, // UID do Auth  ← chave primária
          nome: nome.trim(), // grava o nome!
          email: authUser.email,
          verified: false,
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" } // faz UPDATE se já existir esse id
      );

      if (upsertErr) {
        showMessage("Erro ao guardar dados: " + upsertErr.message);
        setAttemptCount((p) => p + 1);
        return;
      }

      /* 3) Tudo OK -> avisa e avança para o próximo ecrã */
      showMessage("Conta criada com sucesso! Verifique o seu e-mail.");
      navigation.navigate("UltimosDados", {
        userData: {
          id: authUser.id,
          nome: nome.trim(),
          email: authUser.email,
        },
      });
    } catch (err) {
      showMessage("Erro inesperado: " + err.message);
      setAttemptCount((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }

  /* ─────────────  UI  ───────────── */
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={{ marginBottom: 20 }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 20 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20 }}
      />
      <TextInput
        label="Confirmar Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ marginBottom: 20 }}
      />

      {/* Termos e Condições */}
      <View style={styles.row}>
        <Checkbox
          status={isChecked ? "checked" : "unchecked"}
          onPress={() => setIsChecked(!isChecked)}
        />
        <Text>
          Aceito os{" "}
          <Text
            style={styles.sublinhado}
            onPress={() => navigation.navigate("TermosCondicoes")}
          >
            Termos e Condições
          </Text>{" "}
          da BloodPoint.
        </Text>
      </View>

      <Button mode="contained" onPress={handleRegister} disabled={loading}>
        Registar
      </Button>

      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.primary500}
          style={{ marginTop: 20 }}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: Colors.primary500 }}
      >
        {snackbarMsg}
      </Snackbar>
    </ScrollView>
  );
}

/* ─────────────  STYLES  ───────────── */
const styles = StyleSheet.create({
  sublinhado: {
    textDecorationLine: "underline",
    color: Colors.primary500,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
});
