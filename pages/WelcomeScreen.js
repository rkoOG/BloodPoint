import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import Colors from '../constants/colors';
import PrimaryButton from '../components/ui/PrimaryButton';


function WelcomeScreen ({}) {
    const navigation = useNavigation();

    function RegisterScreen() {
        navigation.navigate('RegisterScreen'); //Registar -- Por Fazer
    }

    function Login() {
        navigation.navigate('Login'); //Login -- Por Fazer
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.triangleContainer}>
                <View style={styles.triangle}></View>
                <Text style={styles.title}>BloodPoint</Text>
                <Text style={styles.subtitle}>Seja bem-vindo!</Text>
            </View>
            <View style={styles.buttonContainer}>
                <PrimaryButton onPress={Login}>Iniciar Sessão</PrimaryButton>
            </View>
            <View style={styles.caixaTexto}>
                <Text style={styles.texto}>Ainda não tem conta?
                    <TouchableOpacity onPress={RegisterScreen}>
                        <Text style={styles.highlight}>Registe-se</Text>
                    </TouchableOpacity>
                </Text>
                <Text style={styles.texto1}>© 2025 BloodPoint Technologies Inc.</Text>
            </View>
        </View>
)}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    triangleContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    triangle: {
        position: 'absolute',
        bottom: -23,
        width: 0,
        height: 0,
        borderLeftWidth: 400,
        borderRightWidth: 400,
        borderBottomWidth: 700,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: Colors.primary500, // Cor primária
    },
    title: {
        fontSize: 40,
        fontFamily: 'Inter-Bold',
        color: 'white',
        position: 'absolute',   
        textAlign: 'center',
        top: '45%',
        left: '36%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    subtitle: {
        fontSize: 27,
        fontFamily: 'Inter-bold',
        fontWeight: 'bold',
        color: 'black',
        position: 'absolute',
        textAlign: 'center',
        top: '53%',
        left: '38%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    buttonContainer: {
        position: 'absolute',
        fontFamily: 'Inter-Bold',
        bottom: 230,
        alignItems: 'center',
        justifyContent: 'center',
    },
    caixaTexto: {
        marginTop: 5,
    },
    texto: {
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        fontSize: 14,
        color: 'black',
        bottom: 190,
    },
    highlight: {
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        fontSize: 14,
        textDecorationLine: 'underline', //Teto sublinhado
        color: '#2E0EB9', // Link color
    },
    texto1: {
        position: 'absolute',
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        fontSize: 10,
        left: '7%',
        bottom:17,
    }
});