import { FplService } from "@/app/api/fplService";
import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
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
    <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
      <View className="w-full px-4">
        <Text className="text-white text-xl font-semibold mb-3 text-center">Your Leagues</Text>
        <FlatList
          data={leagues}
          keyExtractor={(item: any) => String(item.id)}
          style={{ width: "100%" }}
          contentContainerStyle={{ alignItems: "stretch" }}
          renderItem={({ item }: any) => (
            <View style={{ padding: 12, backgroundColor: "#212121", borderRadius: 8, marginBottom: 8 }} className="flex flex-row gap-2 justify-between items-center">
              <View className="flex flex-col gap-1">
                <Text className="text-white text-center">Rank</Text>
                <Text className="text-white text-center">{item.rank_count}</Text>
              </View>
              <Text className="text-white text-center">{item.name}</Text>
              <Button
                onPress={() => navigation.navigate("LeaguePlayers", { teamId: item.id, userId: userData?.id })}
              >
                View
              </Button>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}


