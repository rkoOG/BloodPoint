import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from './constants/colors';
import { useFonts } from 'expo-font';
import { Provider as PaperProvider } from 'react-native-paper';


/*SCREENS*/
import WelcomeScreen from './screens/WelcomeScreen'; //Tela inicial
import RegisterScreen from './screens/RegisterScreen';
import UltimosDadosScreen from './screens/UltimosDadosScreen';
import HomeScreen from './screens/Home'; //Tela principal 
import LoginScreen from './screens/Login'; //Tela de login
/**/

const Stack = createStackNavigator();

export default function App() {


  return (
    <PaperProvider>
      <StatusBar style='auto'/>
        <NavigationContainer screenOptions={{headerShown: false}}>
          <Stack.Navigator>
            <Stack.Screen name="BloodPoint" component={WelcomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="UltimosDados" component={UltimosDadosScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
