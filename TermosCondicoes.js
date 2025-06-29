import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';


function TermosCondicoesScreen({ navigation }) {

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Termos e Condições</Text>

        <Text style={styles.subtitle}>
            Bem-vindo à BloodPoint. Ao criar uma conta na nossa app, significa que está a concordar com os seguintes termos e condições:
        </Text>
            <Text styles={styles.texto}>
                {'\n\n'}<Text style={styles.bold}>1.</Text>A sua informação será utilizada apenas para fins relacionados com doação de sangue.
                {'\n\n'}<Text style={styles.bold}>2.</Text>O seu tipo sanguíneo e dados de saúde poderão ser usados para notificações de emergência.
                {'\n\n'}<Text style={styles.bold}>3.</Text>O uso indevido da app poderá resultar em suspensão da conta.
                {'\n\n'}<Text style={styles.bold}>4.</Text>Reservamo-nos o direito de atualizar estes termos sem aviso prévio.
                {'\n\n'}<Text style={styles.bold}>5.</Text>Ao criar uma conta, confirma que tem pelo menos 18 anos ou autorização dos pais.
                {'\n\n'}<Text style={styles.bold}>6.</Text>É responsável por manter a confidencialidade da sua conta e palavra-passe.
                {'\n\n'}<Text style={styles.bold}>7.</Text>Não somos responsáveis por qualquer dano resultante do uso indevido da app.
                {'\n\n'}<Text style={styles.bold}>8.</Text>Ao usar a app, concorda em receber notificações sobre eventos e campanhas.
                {'\n\n'}<Text style={styles.bold}>9.</Text>A BloodPoint não se responsabiliza por qualquer erro ou omissão nas informações fornecidas.
            </Text>
        <Text style={styles.subtitle}>
            Ao continuar, confirma que compreendeu e aceita estes termos.
        </Text>

    </ScrollView>
  );
}

export default TermosCondicoesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  bold: {
    fontWeight: 'bold',
    },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.primary500,
  },
    subtitle: {
        fontSize: 16,
        fontWeight:'500',
        marginBottom: 5,
        marginTop: 10,
        textAlign: 'center',
    },
  texto: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 10,
  },
});