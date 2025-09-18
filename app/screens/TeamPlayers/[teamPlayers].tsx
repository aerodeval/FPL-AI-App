// app/team/[id].tsx
import { FplService } from "@/app/api/fplService";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const elementTypes={
  1: "goalkeeper",
  2: "defender",
  3: "midfielder",
  4: "attacker"
}
const playerTypeSize={
  defender: 5,
  midfielder:5,
  attacker:3,
  goalkeeper:2
}



export default function TeamPlayers() {
    const { team_id,gw_id } = useLocalSearchParams(); // dynamic param from URL
    const normalizedTeamId = Array.isArray(team_id) ? team_id[0] : team_id;
    const normalizedGwId = Array.isArray(gw_id) ? gw_id[0] : gw_id;
    const {
        data: userTeam,
        isLoading: userTeamLoading,
        error: userTeamError,
      } = useQuery({
        queryKey: ["userTeam", normalizedTeamId],
        queryFn: () => FplService.getTeamPlayers(normalizedTeamId, normalizedGwId),
        staleTime: 1000 * 6 * 8,
      });


      // const {
      //   data: userData,
      //   isLoading: userLoading,
      //   error: userError,
      // } = useQuery({
      //   queryKey: ["userData", id],
      //   queryFn: () => FplService.getEntryData(id),
      //   staleTime: 1000 * 6 * 8,
      // });
 

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, paddingHorizontal: 12 }}>
  <Text  className="text-lg my-1">Entry: {normalizedTeamId} | GW: {normalizedGwId}</Text>

  <FlatList
    data={userTeam?.picks}
    keyExtractor={(item) => `${item.element}`}
    renderItem={({ item }) => (
      // <View style={styles.card} className="flex flex-row gap-2 justify-between">
      //   <View className="flex flex-col gap-1">
      //     <Text>Player:</Text>
      //     <Text>{item.element}</Text>
      //   </View>
      //   <Text>{item.element_type}</Text>
      //   <Button onPress={() => router.push({
      //     pathname: "/screens/LeaguePlayers/[teamId]",
      //     params: { teamId: normalizedTeamId },
      //   })}> View</Button>
      // </View>
      
      <View></View>
    )}
  />
    </View></SafeAreaView>
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