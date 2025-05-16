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

function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0); // NOVO

  function showMessage(msg) {
    setSnackbarMsg(msg);
    setSnackbarVisible(true);
  }

  async function handleRegister() {
    if (attemptCount >= 5) {
      showMessage(
        "Limite de tentativas atingido. Por favor, tente mais tarde."
      );
      return;
    }

    if (!nome || !email || !password || !confirmPassword) {
      showMessage("Preencha todos os campos.");
      setAttemptCount((prev) => prev + 1);
      return;
    }
    if (password !== confirmPassword) {
      showMessage("As senhas não coincidem.");
      setAttemptCount((prev) => prev + 1);
      return;
    }
    if (!isChecked) {
      showMessage("É necessário aceitar os Termos e Condições.");
      setAttemptCount((prev) => prev + 1);
      return;
    }

    setLoading(true);

    try {
      const { data: existingUser } = await supabase
        .from("utilizadores")
        .select("id")
        .eq("email", email)
        .single();

      if (existingUser) {
        showMessage("Este email já foi registado. Verifique o seu email.");
        setAttemptCount((prev) => prev + 1);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        if (error.message.includes("rate limit")) {
          showMessage("Limite de tentativas atingido. Tente mais tarde.");
        } else {
          showMessage("Erro ao criar conta: " + error.message);
        }
        setAttemptCount((prev) => prev + 1);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        showMessage("Erro: utilizador não encontrado.");
        setAttemptCount((prev) => prev + 1);
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("utilizadores")
        .insert([
          {
            id: user.id,
            nome,
            email,
            password,
            verified: false,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        showMessage("Erro ao guardar dados: " + insertError.message);
        setAttemptCount((prev) => prev + 1);
        setLoading(false);
        return;
      }

      showMessage("Conta criada com sucesso! Verifique seu e-mail.");
      navigation.navigate("UltimosDados");
    } catch (err) {
      showMessage("Erro inesperado: " + err.message);
      setAttemptCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }

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
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Checkbox
          status={isChecked ? "checked" : "unchecked"}
          onPress={() => setIsChecked(!isChecked)}
        />
        <Text>
          Aceito os{" "}
          <Text
            style={styles.sublinhado}
            onPress={() => navigation.navigate("Termos e Condições")}
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

export default RegisterScreen;

const styles = StyleSheet.create({
  sublinhado: {
    textDecorationLine: "underline",
    color: Colors.primary500,
  },
});
