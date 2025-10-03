import { useRouter } from "expo-router"; // or React Navigation
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BannerButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/nextpage"); // replace with your route
  };

  return (
    <TouchableOpacity style={styles.banner} onPress={handlePress}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Check this out!</Text>
        <Text style={styles.subtitle}>Go to the next page</Text>
      </View>
      <Image
        source={require("./../../assets/images/banner-image.png")} // your image
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
    backgroundColor: "rgba(255, 255, 255, 0.9)", // semi-transparent white
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
  },
  textContainer: {
    flex: 1,
    paddingRight: 10, // space between text and image
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});
