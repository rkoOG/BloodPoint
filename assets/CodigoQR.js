// src/pages/CodigoQr.tsx
import React, { useState, useRef } from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CodigoQR = ({ navigation }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
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
    if (key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const submitCode = () => {
    const finalCode = code.join('');
    if (finalCode.length === 6) {
      alert('Código enviado: ' + finalCode);
    } else {
      alert('Por favor preencha os 6 dígitos.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>LOGO</Text>
      <Text style={styles.title}>Insira o código:</Text>
      <Text style={styles.subtitle}>
        Insira o código fornecido pelo enfermeiro para que a sua doação seja validada.
      </Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, index)}
            maxLength={1}
            keyboardType="numeric"
            ref={(ref) => (inputs.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={submitCode}>
        <Text style={styles.submitText}>ENVIAR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          
          navigation.goBack();
        }}
        style={styles.backArrow}
      >
        <Ionicons name="arrow-back" size={32} color="black" />
      </TouchableOpacity>
    </KeyboardAvoidingView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 75,
  },
  logo: {
    position: 'absolute',
    top: 50,
    right: 24,
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 100,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 10,
    marginBottom: 40,
  },
  codeInput: {
    width: 40,
    height: 50,
    backgroundColor: '#eee',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backArrow: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    zIndex: 10,
    padding: 10, 
  }
});

export default CodigoQR;