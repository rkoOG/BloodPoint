import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../global/supabaseClient";

export default function Login() {
  const navigation = useNavigation();

  /* ─────────────  ESTADO  ───────────── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ─────────────  HANDLER  ───────────── */
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preenche email e password.");
      return;
    }
    setLoading(true);

    /* 1) Autenticar no Supabase */
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Erro", error.message);
      setLoading(false);
      return;
    }

    /* 2) Buscar dados extra do perfil */
    const { data: profile } = await supabase
      .from("utilizadores")
      .select("nome, idade, tipo_sanguineo")
      .eq("id", authData.user.id)
      .maybeSingle();

    /* 3) Construir objeto userData */
    const userData = {
      nome: profile?.nome ?? null,
      email: authData.user.email,
      idade: profile?.idade ?? null,
      tipo_sanguineo: profile?.tipo_sanguineo ?? null,
      level: 1,
    };

    /* 4) Entrar no Home com os dados */
    navigation.reset({
      index: 0,
      routes: [{ name: "Home", params: { userData } }],
    });
  }

  /* ─────────────  UI  ───────────── */
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Iniciar Sessão</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterScreen")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "#00695c" }}>
          Ainda não tens conta? Regista-te
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ─────────────  STYLES  ───────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#c62828",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
