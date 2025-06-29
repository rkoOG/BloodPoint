import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Perfil from "./src/pages/Perfil";
import CodigoQR from "./src/pages/CodigoQR";
import Hospitais from "./src/pages/hospitais";
import Cupao from "./src/pages/Cupao";
import Parceiros from "./src/pages/Parceiros";
import Historico from "./src/pages/Historico";
import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import RegisterScreen from "./src/pages/RegisterScreen";
import UltimosDadosScreen from "./src/pages/UltimosDadosScreen";
import WelcomeScreen from "./src/pages/WelcomeScreen";
import Formulario from "./src/pages/Formulario";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="WelcomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="Hospitais" component={Hospitais} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="CodigoQr" component={CodigoQR} />
        <Stack.Screen name="Cupao" component={Cupao} />
        <Stack.Screen name="Parceiros" component={Parceiros} />
        <Stack.Screen name="Historico" component={Historico} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="Ultimos dados" component={UltimosDadosScreen} />
        <Stack.Screen name="Formulario" component={Formulario} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
