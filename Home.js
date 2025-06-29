// src/pages/Home.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { supabase } from "../global/supabaseClient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.82;

export default function HomeScreen({ route, navigation }) {
  /* ─────────────  CAROUSEL  ───────────── */
  const curiosidades = [
    {
      id: "1",
      description: "Sabia que pode salvar até 3 vidas com uma doação.",
    },
    {
      id: "2",
      description: "Doar sangue não afeta a sua saúde negativamente.",
    },
    {
      id: "3",
      description:
        "O corpo de um adulto tem em média cerca de 5 litros de sangue.",
    },
  ];
  const [slideIndex, setSlideIndex] = useState(0);
  const flatListRef = useRef(null);

  /* ─────────────  USER DATA  ───────────── */
  const initialData = route.params?.userData || null;
  const [userData, setUserData] = useState(initialData);
  const [loadingUser, setLoadingUser] = useState(!initialData);

  /* ─────────────  FOOTER TAB  ───────────── */
  const [activeTab, setActiveTab] = useState("Home");

  /* ─────────────  INSETS  ───────────── */
  const insets = useSafeAreaInsets();

  /* ─────────────  FETCH USER (se necessário)  ───────────── */
  useEffect(() => {
    if (userData?.nome?.trim()) return; // já temos dados
    (async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        setLoadingUser(false);
        return;
      }

      const { data } = await supabase
        .from("utilizadores")
        .select("nome,name,idade,tipo_sanguineo")
        .eq("id", user.id)
        .maybeSingle();

      setUserData(
        data ? { ...data, nome: data?.nome ?? data?.name ?? "" } : null
      );
      setLoadingUser(false);
    })();
  }, []);

  /* ─────────────  CAROUSEL SLIDE AUTO  ───────────── */
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (slideIndex + 1) % curiosidades.length;
      setSlideIndex(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }, 4000);
    return () => clearInterval(timer);
  }, [slideIndex]);

  /* ─────────────  DERIVED VALUES  ───────────── */
  const displayName = userData?.nome?.trim() || "Doador";
  const bloodType = userData?.tipo_sanguineo ?? "--";
  const age = userData?.idade ?? "--";

  /* ─────────────  HANDLERS  ───────────── */
  const handleFormPress = () => navigation.navigate("Formulario");

  /* ─────────────  RENDER  ───────────── */
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 160 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/*  CAROUSEL  */}
        <FlatList
          ref={flatListRef}
          data={curiosidades}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / width);
            setSlideIndex(i);
          }}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <Text style={styles.carouselText}>{item.description}</Text>
            </View>
          )}
        />

        {/*  DOTS  */}
        <View style={styles.dotsRow}>
          {curiosidades.map((_, i) => (
            <Text
              key={i}
              style={[styles.dot, i === slideIndex && styles.dotActive]}
            >
              {"\u2022"}
            </Text>
          ))}
        </View>

        {/*  SAUDAÇÃO  */}
        {loadingUser ? (
          <ActivityIndicator color="#c62828" />
        ) : (
          <Text style={styles.welcome}>Olá, {displayName}</Text>
        )}

        {/*  INFO CARDS  */}
        <View style={styles.infoRow}>
          <TouchableOpacity
            style={styles.infoCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Perfil", { userData })}
          >
            <View style={styles.infoCardInner}>
              <Icon name="water" size={28} color="#c62828" />
              <Text style={styles.infoLabel}>Tipo Sanguíneo</Text>
              <Text style={styles.infoValue}>{bloodType}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoCard} activeOpacity={0.8}>
            <View style={styles.infoCardInner}>
              <Icon name="calendar" size={28} color="#c62828" />
              <Text style={styles.infoLabel}>Idade</Text>
              <Text style={styles.infoValue}>{age}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/*  FORM BUTTON  */}
        <TouchableOpacity
          style={styles.formCard}
          activeOpacity={0.85}
          onPress={handleFormPress}
        >
          <View style={styles.formContentRow}>
            <Text style={styles.formCTAText}>
              Clique aqui para preencher o formulário
            </Text>
            <Icon name="chevron-right" size={28} color="#c62828" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/*  FOOTER NAV  */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 12 }]}>
        <TouchableOpacity
          onPress={() => {
            setActiveTab("Hospitais");
            navigation.navigate("Hospitais");
          }}
          style={[
            styles.footerBtn,
            activeTab === "Hospitais" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="magnify"
            size={28}
            color={activeTab === "Hospitais" ? "#fff" : "#555"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActiveTab("Home");
            navigation.navigate("Home");
          }}
          style={[
            styles.footerBtn,
            activeTab === "Home" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="home"
            size={30}
            color={activeTab === "Home" ? "#fff" : "#555"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActiveTab("Perfil");
            navigation.navigate("Perfil", { userData });
          }}
          style={[
            styles.footerBtn,
            activeTab === "Perfil" && styles.footerBtnActive,
          ]}
        >
          <Icon
            name="account"
            size={28}
            color={activeTab === "Perfil" ? "#fff" : "#555"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ─────────────  STYLES  ───────────── */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  content: { paddingTop: 40, paddingHorizontal: 16 },

  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: 14,
    backgroundColor: "#c62828",
    borderRadius: 14,
    paddingVertical: 40,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselText: { color: "#fff", fontSize: 16, textAlign: "center" },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  dot: { fontSize: 18, color: "#bbb", marginHorizontal: 2 },
  dotActive: { color: "#c62828" },

  welcome: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c62828",
    borderRadius: 14,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardInner: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  infoLabel: { color: "#666", marginTop: 6, fontSize: 13 },
  infoValue: { fontSize: 18, fontWeight: "bold", marginTop: 4 },

  formCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c62828",
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formCTAText: { fontSize: 16, color: "#333", marginRight: 8 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerBtn: { flex: 1, alignItems: "center", paddingVertical: 10 },
  footerBtnActive: {
    backgroundColor: "#c62828",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
});
