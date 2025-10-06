// app/team/[id].tsx
import { FplService } from "@/app/api/fplService";
import { Button } from "@react-navigation/elements";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";




export default function TeamScreen() {
    const { id } = useLocalSearchParams(); // dynamic param from URL
    const {
        data: userData,
        isLoading: userLoading,
        error: userError,
      } = useQuery({
        queryKey: ["userData", id],
        queryFn: () => FplService.getEntryData(id),
        staleTime: 1000 * 6 * 8,
      });

 

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1, paddingHorizontal: 12,}}>
  <Text  className="text-lg my-1">
              Team Name: {userData?.name}

      

            <FlatList data={userData?.leagues.classic} keyExtractor={(item) => item.id}  renderItem={({ item }) => (
          <View  style={styles.card}   className="flex flex-row gap-2 justify-between">
                     <View className="flex flex-col gap-1">
                     <Text>Rank:</Text>
            <Text>
            {item.entry_rank}</Text></View> 
            <Text>{item.name}</Text>
            <Button   onPress={() => router.push({
                pathname: "/screens/LeaguePlayers/[teamId]",
                params: { teamId: item.id, userId: userData?.id },
              })
              }> View</Button>
          </View>
        )}></FlatList>
              </Text>
    </ScrollView></SafeAreaView>
  );
}


const styles = StyleSheet.create({
    card: {
      padding: 12,
      backgroundColor: "#212121",
      borderRadius: 8,
      marginBottom: 8,
      color:"#FFFFFF"
    },
    title: {
      fontWeight: "bold",
      fontSize: 16,
    },
  });