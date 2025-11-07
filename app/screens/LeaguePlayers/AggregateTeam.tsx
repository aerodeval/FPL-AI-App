import { FplService } from "@/app/api/fplService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AggregateTeam() {
  const navigation = useNavigation<any>();
  const route = useRoute() as any;
  const teamId = route.params?.teamId;
  const userId = route.params?.userId;

  const [aggregateTeamData, setAggregateTeamData] = useState<any>(null);
  const [isGeneratingAggregate, setIsGeneratingAggregate] = useState(true);

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

  // Fetch bootstrap data for player details
  const {
    data: bootstrapData,
    isLoading: bootstrapLoading,
  } = useQuery({
    queryKey: ["bootstrap"],
    queryFn: () => FplService.getBootstrapData(),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const generateAggregateTeam = async () => {
      if (!teamData?.standings?.results || !userData?.current_event) {
        setIsGeneratingAggregate(false);
        return;
      }

      setIsGeneratingAggregate(true);
      try {
        const top10Teams = teamData.standings.results.slice(0, 10);
        const playerCountMap: Record<number, number> = {};
        const playerPositionMap: Record<number, number> = {}; // Store element_type for each player

        // Fetch team players for top 10 teams
        const teamPromises = top10Teams.map((team: any) =>
          FplService.getTeamPlayers(team.entry, userData.current_event)
            .then((teamPlayers: any) => {
              if (teamPlayers?.picks) {
                // Only count starters (position <= 11)
                teamPlayers.picks
                  .filter((pick: any) => pick.position <= 11)
                  .forEach((pick: any) => {
                    playerCountMap[pick.element] = (playerCountMap[pick.element] || 0) + 1;
                    playerPositionMap[pick.element] = pick.element_type;
                  });
              }
            })
            .catch((err) => {
              console.error(`Error fetching team ${team.entry}:`, err);
            })
        );

        await Promise.all(teamPromises);

        // Convert to array and sort by count (descending)
        const playerCounts = Object.entries(playerCountMap).map(([playerId, count]) => ({
          playerId: parseInt(playerId),
          count,
          elementType: playerPositionMap[parseInt(playerId)],
        }));

        // Group by position and get top players for each position
        const gk = playerCounts
          .filter((p) => p.elementType === 1)
          .sort((a, b) => b.count - a.count)
          .slice(0, 2); // Top 2 goalkeepers

        const def = playerCounts
          .filter((p) => p.elementType === 2)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 defenders

        const mid = playerCounts
          .filter((p) => p.elementType === 3)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 midfielders

        const att = playerCounts
          .filter((p) => p.elementType === 4)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3); // Top 3 attackers

        setAggregateTeamData({ gk, def, mid, att });
      } catch (error) {
        console.error("Error generating aggregate team:", error);
      } finally {
        setIsGeneratingAggregate(false);
      }
    };

    if (teamData && userData && bootstrapData) {
      generateAggregateTeam();
    }
  }, [teamData, userData, bootstrapData]);

  if (teamLoading || userLoading || bootstrapLoading || isGeneratingAggregate) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.textAccent} />
          <Text style={[typography.caption, { marginTop: 12 }]}>
            Generating safe team from top 10 teams...
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (teamError || userError) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={typography.caption}>Failed to load data.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={{ flex: 1, paddingHorizontal: 14 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={typography.tagline}>Safe Aggregate Team</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {aggregateTeamData && (
            <>
              {/* Goalkeepers */}
              <View style={styles.positionSection}>
                <Text style={typography.subtitle}>Goalkeepers</Text>
                {aggregateTeamData.gk.map((item: any) => {
                  const player = bootstrapData?.elements?.find(
                    (p: any) => p.id === item.playerId
                  );
                  if (!player) return null;
                  return (
                    <View key={item.playerId} style={styles.aggregatePlayerCard}>
                      <Text style={typography.body}>{player.web_name}</Text>
                      <Text style={typography.accent}>Selected by {item.count}/10 teams</Text>
                    </View>
                  );
                })}
              </View>

              {/* Defenders */}
              <View style={styles.positionSection}>
                <Text style={typography.subtitle}>Defenders</Text>
                {aggregateTeamData.def.map((item: any) => {
                  const player = bootstrapData?.elements?.find(
                    (p: any) => p.id === item.playerId
                  );
                  if (!player) return null;
                  return (
                    <View key={item.playerId} style={styles.aggregatePlayerCard}>
                      <Text style={typography.body}>{player.web_name}</Text>
                      <Text style={typography.accent}>Selected by {item.count}/10 teams</Text>
                    </View>
                  );
                })}
              </View>

              {/* Midfielders */}
              <View style={styles.positionSection}>
                <Text style={typography.subtitle}>Midfielders</Text>
                {aggregateTeamData.mid.map((item: any) => {
                  const player = bootstrapData?.elements?.find(
                    (p: any) => p.id === item.playerId
                  );
                  if (!player) return null;
                  return (
                    <View key={item.playerId} style={styles.aggregatePlayerCard}>
                      <Text style={typography.body}>{player.web_name}</Text>
                      <Text style={typography.accent}>Selected by {item.count}/10 teams</Text>
                    </View>
                  );
                })}
              </View>

              {/* Attackers */}
              <View style={styles.positionSection}>
                <Text style={typography.subtitle}>Attackers</Text>
                {aggregateTeamData.att.map((item: any) => {
                  const player = bootstrapData?.elements?.find(
                    (p: any) => p.id === item.playerId
                  );
                  if (!player) return null;
                  return (
                    <View key={item.playerId} style={styles.aggregatePlayerCard}>
                      <Text style={typography.body}>{player.web_name}</Text>
                      <Text style={typography.accent}>Selected by {item.count}/10 teams</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}
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
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 12,
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
    fontSize: 28,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
    letterSpacing: 0.8,
    fontFamily: "Jolly Lodger",
    flex: 1,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 14,
  },
  positionSection: {
    marginBottom: 20,
  },
  aggregatePlayerCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
});

