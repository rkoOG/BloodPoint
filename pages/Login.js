import React, { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../global/supabaseClient";
import * as ImagePicker from "expo-image-picker";

/* —— USER STATE —— */
const initialUser = {
  name: "Insira Nome",
  email: "Insira Email",
  level: 1,
};

const sectionsData = [
  { icon: "💰", text: "Usar Cupão", route: "Cupao" },
  { icon: "🌐", text: "Parceiros", route: "Parceiros" },
  { icon: "⏳", text: "Histórico de Doações", route: "Historico" },
  { icon: "🔳", text: "Inserir código", route: "CodigoQr" },
];

export default function Perfil() {
  const navigation = useNavigation();
  const route = useRoute();
  const passedUser = route.params?.userData;

  const [user, setUser] = useState({
    name: passedUser?.nome || initialUser.name,
    email: passedUser?.email || initialUser.email,
    level: 1,
  });

  const [selectedTab, setSelectedTab] = useState("Perfil");
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (passedUser?.email) return;

    (async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !authUser) return;

      const { data, error } = await supabase
        .from("utilizadores")
        .select("nome, email")
        .eq("id", authUser.id)
        .maybeSingle();

      if (data) {
        const fullUser = {
          name: data.nome || initialUser.name,
          email: data.email || authUser.email || initialUser.email,
          level: 1,
        };
        setUser(fullUser);
      } else if (authUser.email) {
        setUser((prev) => ({
          ...prev,
          email: authUser.email,
        }));
      }
    })();
  }, []);

  const handleSearchPress = () => {
    setSelectedTab("Buscar");
    navigation.navigate("Hospitais");
  };
  const handleHomePress = () => {
    setSelectedTab("Home");
    navigation.navigate("Home");
  };
  const handleProfilePress = () => setSelectedTab("Perfil");

  const openEdit = () => {
    setModalVisible(true);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso às fotos para alterar a imagem de perfil."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const iconColor = (tab) => (selectedTab === tab ? "#000" : "#999");
  const textStyle = (tab) => [
    styles.navItemText,
    selectedTab === tab && styles.navItemTextActive,
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() =>
            Alert.alert("Opções", "Funcionalidade em desenvolvimento.")
          }
        >
          <Text style={styles.headerIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN */}
      <View style={styles.main}>
        <View style={styles.profileHeader}>
          <View style={{ alignItems: "center", marginRight: 15 }}>
            <TouchableOpacity style={styles.profilePicture} onPress={openEdit}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 90, height: 90, borderRadius: 45 }}
                />
              ) : (
                <Text style={styles.initials}>
                  {user.name.trim()[0]?.toUpperCase() || "A"}
                </Text>
              )}
            </TouchableOpacity>
            {/* Botão Editar por baixo do círculo */}
            <TouchableOpacity onPress={openEdit}>
              <Text style={styles.editButtonBelow}>Editar Foto</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profileLevel}>Nível {user.level}</Text>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          {sectionsData.map((s) => (
            <TouchableOpacity
              key={s.text}
              style={styles.sectionItem}
              onPress={() => navigation.navigate(s.route)}
            >
              <Text style={styles.sectionIcon}>{s.icon}</Text>
              <Text style={styles.sectionText}>{s.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FOOTER NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleSearchPress}>
          <Ionicons name="search" size={28} color={iconColor("Buscar")} />
          <Text style={textStyle("Buscar")}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
          <Ionicons name="home-outline" size={26} color={iconColor("Home")} />
          <Text style={textStyle("Home")}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfilePress}>
          <Ionicons
            name="person-outline"
            size={26}
            color={iconColor("Perfil")}
          />
          <Text style={textStyle("Perfil")}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL EDITAR FOTO */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Foto de Perfil</Text>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#d32f2f" }]}
              onPress={pickImage}
            >
              <Text style={{ color: "#fff" }}>Escolher da Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  headerButton: { padding: 25 },
  headerIcon: { fontSize: 40 },
  headerTitle: { fontSize: 30, fontWeight: "bold" },
  main: { flex: 1, paddingHorizontal: 15, paddingTop: 50 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 25,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { fontSize: 32, color: "#fff" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  profileEmail: { fontSize: 16, color: "#666", marginBottom: 4 },
  profileLevel: { fontSize: 16, color: "#009688", marginBottom: 6 },
  // Novo estilo para o botão "Editar Foto" por baixo do círculo
  editButtonBelow: {
    fontSize: 16,
    color: "#00695c",
    textDecorationLine: "underline",
    marginTop: 8,
    textAlign: "center",
  },
  editButton: {
    fontSize: 16,
    color: "#00695c",
    textDecorationLine: "underline",
    // Removido de uso, mas mantido caso queira usar noutro local
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionIcon: { fontSize: 22, marginRight: 12 },
  sectionText: { fontSize: 18, color: "#333" },
  bottomNav: {
    position: "absolute",
    bottom: 75,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    zIndex: 2,
    elevation: 6,
  },
  navItem: { alignItems: "center", flex: 1 },
  navItemText: { fontSize: 12, color: "#999" },
  navItemTextActive: { fontSize: 12, color: "#000", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalBtn: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
});
