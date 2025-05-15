import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Menu, Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import PrimaryButton from '../components/ui/PrimaryButton';

function UltimosDadosScreen() {
  const navigation = useNavigation();

  const [numeroUtente, setNumeroUtente] = useState('');
  const [idade, setIdade] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  function goBack() {
    navigation.goBack();
  }

  function handleSubmit() {
    console.log("Conta criada com sucesso!");
  }

  return (
    <Provider>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Últimos Detalhes</Text>

        <TextInput
          label="Nº Utente de Saúde"
          value={numeroUtente}
          onChangeText={setNumeroUtente}
          style={styles.input}
          mode="outlined"
        />

        <View style={styles.row}>
          <TextInput
            style={styles.inputIdade}
            label="Idade"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
            mode="outlined"
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TextInput
                label="Tipo Sanguíneo"
                value={bloodType}
                style={styles.inputTipoSanguineo}
                mode="outlined"
                onFocus={() => setMenuVisible(true)}
                right={<TextInput.Icon icon="menu-down" />}
              />
            }
          >
            {bloodTypes.map((type) => (
              <Menu.Item
                key={type}
                onPress={() => {
                  setBloodType(type);
                  setMenuVisible(false);
                }}
                title={type}
              />
            ))}
          </Menu>
        </View>

        <View style={{ marginTop: 30 }}>
          <PrimaryButton onPress={handleSubmit} >Registar!</PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </Provider>
  );

  function handleSubmit() {
    if (!numeroUtente || !idade || !bloodType) {
      alert("Preencha todos os campos.");
      return;
    }
    navigation.navigate('Home'); 
  }
}

export default UltimosDadosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 50,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:10,
  },
  inputIdade: {
    width: '25%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 15,
  },
  inputTipoSanguineo: {
    width: '75%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 15,
  },
});
