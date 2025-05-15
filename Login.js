import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase/supabaseClient';

/*COMPONENTS*/
import PrimaryButton from '../components/ui/PrimaryButton';
import BloodDropBackground from '../components/background'; 

function RegisterScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function goBack() {
        navigation.goBack(); 
    }
    


    async function handleLogin() {
        if (!email || !password) {
            Alert.alert("Preencha todos os campos.");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert("Erro ao autenticar: " + error.message);
            return;
        }
        //Em caso de sucesso:
        navigation.navigate('Home'); // Navegar para a página principal 
    }

    return (
        <View style={styles.container}>
        <BloodDropBackground />
  
        {/* Botão de voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
  
        <Text style={styles.title}>Autenticação</Text>
  
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
  
        <View style={styles.buttonWrapper}>
          <PrimaryButton onPress={handleLogin}>Seguinte</PrimaryButton>
        </View>
      </View>
);
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 80,
        alignItems: 'center',
        gap: 20,
      },
      backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
      },
      title: {
        fontSize: 26,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 30,
        marginLeft: 20,
      },
      input: {
        width: '90%',
        height: 45,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 15,
      },
      buttonWrapper: {
        marginTop: 80,
        width: '100%',
        alignItems: 'center',
      },
})