import { View, Text, Pressable, StyleSheet } from "react-native";


import Colors from "../../constants/colors";

function PrimaryButton({children,onPress}) { //Quando o botão for pressionado, a função onPress será chamada
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        android_ripple={{ color: Colors.primary500 }}
        style={({ pressed }) =>
          pressed ? [styles.buttonInnerContainer, styles.pressed] : styles.buttonInnerContainer
        }
        onPress={onPress}
      >
        <Text style={[styles.buttonText]}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 15,
    elevation: 4,
  },
  buttonInnerContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: 230,
  },
  buttonText: {
    fontFamily: "Inter-Bold",
    color: "black",
    textAlign: "center",
    fontSize: 22,
  },
  pressed: {
    opacity: 0.75,
  },
});