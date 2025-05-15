import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { supabase } from '../supabase/supabaseClient';


/*COMPONENTS*/
import PrimaryButton from '../components/ui/PrimaryButton';
import BloodDropBackground from '../components/background'; 



function RegisterScreen() {
    const navigation = useNavigation();
    const [isChecked, setIsChecked] = useState(false);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function goBack() {
        navigation.goBack(); // Voltar à tela anterior
    }
    
    async function handleRegister() {
        if (!nome || !email || !password || !confirmPassword) {
            alert("Preencha todos os campos.");
            return;
        }
        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }
        if (!isChecked) {
            alert("É necessário aceitar os Termos e Condições.");
            return;
        }
    
    //Criação do utilizadores (1/2)
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert("Erro ao criar conta: " + error.message);
            return;
        } 

        const user = data.user;
        if (!user) {
            alert("Erro ao criar conta: usuário não encontrado.");
            return;
        }

        const { error: insertError } = await supabase
            .from('utilizadores')
            .insert([
                { id: user.id,
                  nome: nome, 
                  email: email, 
                  password: password,
                  verified: false,
                  created_at: new Date().toISOString(),
                },
            ]);
        
            if (insertError) {
                alert("Erro ao inserir dados: " + insertError.message);
                return;
            }
        alert("Conta criada com sucesso! Verifique seu e-mail para confirmar.");
        navigation.navigate('UltimosDados');
    }
    catch (error) {
        alert("Ocorreu um erro inesperado: " + error.message);
    } 

}
    return (
        /*
        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirmar Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        */
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <BloodDropBackground /> 
        <View style={styles.container}>
            
            {/* Botão de Voltar */}
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title} >Crie uma conta!</Text>
            
            <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <TextInput style={styles.input} placeholder="Confirmar Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

            <View style={styles.checkboxContainer}>
            <Pressable onPress={() => setIsChecked(!isChecked)} style={styles.checkbox}>
                {isChecked && <View style={styles.checked} />}
            </Pressable>
            <Text style={styles.termsText}>
                Declaro que tomei conhecimento dos{' '}
                <Text style={styles.highlight}>Termos e Condições</Text> da BloodPoint.
            </Text>
            </View>

            {/* Botão com marginTop para empurrar para o fim */}
            <View style={{ marginTop: '20%', width: '100%', alignItems: 'center' }}>
            <PrimaryButton 
                    style={[styles.seguinteButton]} 
                        onPress={handleRegister}
                >Seguinte
            </PrimaryButton>
            </View>
        </View>
        </ScrollView>
    );
}


export default RegisterScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        margin: 5,
        marginLeft: 0,
        fontSize: 26,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        paddingVertical: 10,
    },
    container: {
        flex: 1,
        minHeight: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 80,
        gap: 10,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    input: {
        width: '100%',
        height: 45,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 4,
    },
    checked: {
        width: 14,
        height: 14,
        backgroundColor: Colors.primary500,
    },
    termsText: {
        flex: 1,
        fontSize: 12,
    },
    highlight: {
        textDecorationLine: 'underline',
        color: Colors.primary500,
    },
    seguinteButton: {
        backgroundColor: Colors.primary500,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        color: Colors.primary500,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.primary500,
    },

});
