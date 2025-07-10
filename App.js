import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Perfil from "./pages/Perfil";
import CodigoQR from "./pages/CodigoQR";
import Hospitais from "./pages/hospitais";
import Cupao from "./pages/Cupao";
import Parceiros from "./pages/Parceiros";
import Historico from "./pages/Historico";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterScreen from "./pages/RegisterScreen";
import UltimosDadosScreen from "./pages/UltimosDadosScreen";
import WelcomeScreen from "./pages/WelcomeScreen";
import Formulario from "./pages/Formulario";

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
