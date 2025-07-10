import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { STATUS } from "./hospitais";
import { supabase } from "../global/supabaseClient"; 

const CodigoQR = ({ navigation }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (key, index) => {
    if (key === "Backspace" && code[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const submitCode = async () => {
    const finalCode = code.join("");
    console.log("Código inserido:", finalCode);
    if (finalCode.length === 6) {
      const {data, error} = await supabase
        .from("doacoes")
        .select("*")
        .eq("confirm_code", finalCode)
        .eq("status", STATUS.PENDENTE)
        .maybeSingle();

      if (error) {
        Alert.alert("Erro", "Não foi possível validar o código.");
        return;
      }
      
      if (data) { //Atualizar o status da doação
        const { error:updateError } = await supabase
          .from("doacoes")
          .update({ status: STATUS.CONFIRMADA })
          .eq("confirm_code", finalCode);

        if (updateError) {
          alert("Erro", "Erro ao confirmar a doação.");
        } else {
          alert("Sucesso", "A doação foi confirmada com sucesso!");
        }
      } else {
        alert("Erro", "Código inválido ou já utilizado.");
      }

    } else {
      Alert.alert("Erro", "Por favor, insira um código de 6 dígitos.");
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header com seta à esquerda e logo à direita */}
      <View
        style={{
          width: "100%",
          height: 70,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10, marginLeft: 0 }}
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Insira o código:</Text>
      <Text style={styles.subtitle}>
        Insira o código fornecido para que a sua doação seja
        validada.
      </Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleBackspace(nativeEvent.key, index)
            }
            maxLength={1}
            keyboardType="numeric"
            ref={(ref) => (inputs.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={submitCode}>
        <Text style={styles.submitText}>ENVIAR</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 75,
  },
  logo: {
    width: 120,
    height: 60,
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 10,
    marginBottom: 40,
  },
  codeInput: {
    width: 40,
    height: 50,
    backgroundColor: "#eee",
    textAlign: "center",
    fontSize: 18,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backArrow: {
    position: "absolute",
    zIndex: 10,
    padding: 10,
  },
});

export default CodigoQR;
