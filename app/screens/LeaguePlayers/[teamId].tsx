import { FplService } from "@/app/api/fplService";
import { Button } from "@react-navigation/elements";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamId() {
  const { teamId } = useLocalSearchParams();
  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
  } = useQuery({
    queryKey: ["teamData", teamId],
    queryFn: () => FplService.getTeamData(teamId),
    staleTime: 1000 * 6 * 8,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1 ,paddingHorizontal: 12}}>
      {teamLoading && <Text>Loading standings...</Text>}
      {!teamLoading && teamError && <Text>Failed to load standings.</Text>}
      {!teamLoading && !teamError && (teamData?.standings?.results ?? []).map((player: any) => (
     
       <View className="flex justify-between" key={player?.entry ?? player?.id ?? String(player?.rank)} style={styles.card}>
 <View>
          <Text style={styles.cardText}>{player?.rank}. {player?.player_name}</Text>
      
          <Text style={styles.cardText}>Team: {player?.entry_name}</Text>
          <Text style={styles.cardText}>Total Points: {player?.total}</Text>
          <Text style={styles.cardText}>GW Points: {player?.event_total}</Text></View>

          <Button>View Team</Button>
          </View>
     
      ))}
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
  cardText: {

    color:"#FFFFFF"
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
