import { FplService } from "@/app/api/fplService";
import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTeamStore } from "../../store/useTeam";

export default function Leagues() {
  const { teamId } = useTeamStore();
  const navigation: any = useNavigation();

  useEffect(() => {
    if (!teamId) router.replace("/enter");
  }, [teamId]);

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["userData", teamId],
    queryFn: () => FplService.getEntryData(teamId),
    enabled: Boolean(teamId),
    staleTime: 1000 * 60 * 5,
  });

  if (!teamId) return null;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
        <Text className="text-white text-center">Loading leagues...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
        <Text className="text-white text-center">Failed to load leagues.</Text>
      </SafeAreaView>
    );
  }

  const leagues = userData?.leagues?.classic ?? [];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 8 }}>
      <View style={{ width: "100%", marginTop: 4 }}>
        <Text className="text-black text-xl font-semibold mb-3 text-left">
          {userData.player_first_name}&apos;s Leagues
        </Text>

        <FlatList
          data={leagues}
          keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: any) => (
          <View
            style={{
              padding: 12,
              backgroundColor: "#212121",
              borderRadius: 4,
              marginBottom: 2,
            }}
            className="flex flex-row justify-between items-center gap-6"
          >
     
  
            <Text className="text-white text-left flex-1 ">{item.name}</Text>
            <View className="flex flex-col items-start">
              <Text className="text-white text-left">Rank</Text>
              <Text className="text-white text-left">{item.entry_rank}</Text>
              <Button
           
           onPress={() =>
             navigation.navigate("LeaguePlayers", {
               teamId: item.id,
               userId: userData?.id,
             })
           }
         >View</Button>
           
            </View>
        
          </View>
        )}
      />
    </View>
  </ScrollView>
  
  );
}


