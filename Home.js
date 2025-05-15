import React, { useEffect, useState, useRef} from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton, } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { supabase } from '../supabase/supabaseClient';

import Colors from '../constants/colors';

function HomeScreen() {
  const userName = "utilizadores";
  const userAge = "Idade";
  const userBloodType = "Tipo Sanguíneo";

  const { width } = Dimensions.get('window');

  /*Items do carrossel*/
  const  curiosidades = [
    { id: '1', description: 'Sabia que pode salvar até 3 vidas com uma doação' },
    { id: '2', description: 'Doar sangue não afeta a sua saúde negativamente' },
    { id: '3', description: 'Sabia que o corpo de um adulto tem em média cerca de 5 litros' },
    { id: '4', description: 'treino treino treino treino treino' },
    ];

    const [slideIndex, setSlideIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (slideIndex + 1) % curiosidades.length;
            setSlideIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
        }, 4000); //4 segundo entre as curiosidades do carrossel 

        return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
    }, [slideIndex]);

    /*Fim do carrossel*/

    return (
        <View>
            <FlatList
            ref={flatListRef}
            data={curiosidades}
            horizontal
            paggingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setSlideIndex(index);
            }}
            renderItem={({ item }) => (
                <Card style={{ width: width - 40, marginRight: 10 }}>
                    <Card.Content style={{ padding: 20 }}>
                        <Text style={styles.cardTitle}>{item.texto}</Text>
                    </Card.Content>
                </Card>
            )}
            keyExtractor={(item) => item.id}
            />
            <Text style={styles.title}>Olá, {userData.nome}
                {curiosidades.map((_, idx) => (idx === slideIndex ? <Text key={idx} style={styles.cardDots}>•</Text> : <Text key={idx} style={styles.cardDots}>◦</Text>))}
            </Text>
        </View>
    )
}

export default HomeScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardDots: {
    fontSize: 18,
    textAlign: 'center',
  },
  userDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dataCard: {
    width: '48%',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dataLabel: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
    textAlign: 'center',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    borderRadius: 16,
    paddingBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
    triangleFooterContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 0,
        alignItems: 'center',
       
    },
  triangleFooter: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    height: 0,
    borderLeftWidth: width * 0.20,
    borderRightWidth: width * 0.20,
    borderBottomWidth: width * 0.5,

    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.primary500,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
