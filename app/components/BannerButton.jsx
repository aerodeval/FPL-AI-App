import { useRouter } from "expo-router"; // or React Navigation
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BannerButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/nextpage"); // replace with your route
  };

  return (
    <TouchableOpacity style={styles.banner} onPress={handlePress}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Check out the best transfers recommended by FutAI</Text>
      </View>
      <Image
        source={require("./../../assets/images/banner-img.png")} 
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight:16,
    borderRadius: 12,
    marginTop:51,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
    backgroundColor:"#00D595",
    maxHeight:84
  },
  textContainer: {
    flex: 1,
    minWidth:80,
    paddingRight: 10, // space between text and image
  },
  title: {
    color: "#FFF",
    fontSize:10,
    fontWeight:700
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  image: {
    maxWidth: 233,
    minHeight: 135,
    bottom:25,
  
  },
});
