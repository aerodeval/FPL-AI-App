import { FplService } from "@/app/api/fplService";
import TransfersList from "@/app/components/TransfersList"; // ✅ import correctly
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable layout animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TeamId() {
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const toggleTransfers = (teamId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTeam((prev) => (prev === teamId ? null : teamId));
  };

  const { teamId: teamIdParam, userId: userIdParam } = useLocalSearchParams();
  const route = useRoute() as any;
  const navigation = useNavigation<any>();

  const teamId = route.params?.teamId ?? teamIdParam;
  const userId = route.params?.userId ?? userIdParam;

  //  Fetch team standings data
  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
  } = useQuery({
    queryKey: ["teamData", teamId],
    queryFn: () => FplService.getTeamData(teamId),
    staleTime: 1000 * 60 * 8,
  });

  //  Fetch user info (for current event)
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userData", userId],
    queryFn: () => FplService.getEntryData(userId),
    staleTime: 1000 * 60 * 8,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
        {teamLoading && <Text>Loading standings...</Text>}
        {!teamLoading && teamError && <Text>Failed to load standings.</Text>}

        {!teamLoading &&
          !teamError &&
          (teamData?.standings?.results ?? []).map((player: any) => (
            <View
              key={player?.entry ?? player?.id ?? String(player?.rank)}
              style={styles.card}
              className="flex justify-between"
            >
              {/* Player Info */}
              <View>
                <Text style={styles.cardText}>
                  {player?.rank}. {player?.player_name}
                </Text>
                <Text style={styles.cardText}>Team: {player?.entry_name}</Text>
                <Text style={styles.cardText}>Total Points: {player?.total}</Text>
                <Text style={styles.cardText}>GW Points: {player?.event_total}</Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <Button
                  title="View Team"
                  onPress={() =>
                    navigation.navigate("TeamPlayers", {
                      teamPlayers: `${player?.entry}-${userData?.current_event}`,
                      team_id: player?.entry,
                      gw_id: userData?.current_event,
                    })
                  }
                />

                <TouchableOpacity onPress={() => toggleTransfers(player.entry)}>
                  <Text style={styles.transferToggle}>
                    {expandedTeam === player.entry ? "Hide Transfers ▲" : "Show Transfers ▼"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Dropdown: Transfers */}
              {expandedTeam === player.entry && (
                <View style={styles.transferContainer}><Text>{player.entry}</Text>

                  <TransfersList team_id={player.entry} />
                </View>
              )}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  cardText: { color: "#333", fontSize: 14, marginBottom: 3 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  transferToggle: {
    color: "#007AFF",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  transferContainer: {
    backgroundColor: "#f7f7f7",
    marginTop: 8,
    borderRadius: 8,
    padding: 8,
  },
});
