import { FplService } from "@/app/api/fplService";
import TransfersList from "@/app/components/TransfersList";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
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

  // Fetch team standings
  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
  } = useQuery({
    queryKey: ["teamData", teamId],
    queryFn: () => FplService.getTeamData(teamId),
    staleTime: 1000 * 60 * 8,
  });

  // Fetch user info
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
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={{ flex: 1, paddingHorizontal: 14 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={typography.tagline}>League Standings</Text>

          {teamLoading && <Text style={typography.caption}>Loading standings...</Text>}
          {!teamLoading && teamError && (
            <Text style={typography.caption}>Failed to load standings.</Text>
          )}

          {!teamLoading &&
            !teamError &&
            (teamData?.standings?.results ?? []).map((player: any) => (
              <View key={player?.entry ?? player?.id ?? String(player?.rank)} style={styles.card}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                  <Text style={typography.title}>
                    {player?.rank}. {player?.player_name}
                  </Text>
                  <Text style={typography.subtitle}>Team: {player?.entry_name}</Text>
                </View>

                {/* Points */}
                <View style={styles.statsRow}>
                  <Text style={typography.body}>Total: {player?.total}</Text>
                  <Text style={typography.caption}>GW: {player?.event_total}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("TeamPlayers", {
                        teamPlayers: `${player?.entry}-${userData?.current_event}`,
                        team_id: player?.entry,
                        gw_id: userData?.current_event,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>View Team</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => toggleTransfers(player.entry)}>
                    <View style={styles.transferToggle}>
                      <Text style={typography.accent}>
                        {expandedTeam === player.entry ? "Hide Transfers" : "Show Transfers"}
                      </Text>
                      <Ionicons
                        name={
                          expandedTeam === player.entry
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                        }
                        size={14}
                        color={colors.textAccent}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Transfers List */}
                {expandedTeam === player.entry && (
                  <View style={styles.transferContainer}>
                    <TransfersList team_id={player.entry} />
                  </View>
                )}
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const colors = {
  gradientStart: "#8d004f",
  gradientEnd: "#430053",
  textPrimary: "#ffffff",
  textSecondary: "#f5e6ff",
  textMuted: "#d4a9e0",
  textAccent: "#ffb6e6",
};

const typography = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    fontFamily: "Inter",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  accent: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textAccent,
  },
  tagline: {
    fontSize: 34,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
    marginVertical: 14,
    letterSpacing: 0.8,
    fontFamily: "Jolly Lodger",
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: "#ff80c7",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  transferToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  transferContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },
});
