import { FplService } from "@/app/api/fplService";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TransfersList({ team_id }: { team_id: number }) {
  const {
    data: userTransfer,
    isLoading: userTransferLoading,
    error: userTransferError,
  } = useQuery({
    queryKey: ["userTransfer", team_id],
    queryFn: () => FplService.getPlayerTransfers(team_id),
    enabled: !!team_id,
    staleTime: 1000 * 60 * 10,
  });

  const {
    data: bootstrapData,
    isLoading: bootstrapLoading,
    error: bootstrapError,
  } = useQuery({
    queryKey: ["bootstrap"],
    queryFn: () => FplService.getBootstrapData(),
    staleTime: 1000 * 60 * 60,
  });

  if (userTransferLoading || bootstrapLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={colors.textAccent} />
        <Text style={typography.caption}>Loading transfers...</Text>
      </View>
    );
  }

  if (userTransferError || bootstrapError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {userTransferError?.message ||
            bootstrapError?.message ||
            "Error fetching transfer data"}
        </Text>
      </View>
    );
  }

  const transfers = userTransfer ?? [];
  const highestEvent = Math.max(...transfers.map((t) => t.event), 0);
  const latestTransfers = transfers.filter((t) => t.event === highestEvent);

  const playerMap: Record<number, string> = {};
  bootstrapData?.elements?.forEach((el: any) => {
    playerMap[el.id] = el.web_name;
  });

  if (latestTransfers.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={typography.caption}>No transfers made yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={latestTransfers}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.transferCard}>
          <View style={styles.transferHeader}>
            <Ionicons name="swap-horizontal-outline" size={16} color={colors.textAccent} />
            <Text style={typography.accent}>Gameweek {item.event}</Text>
          </View>

          <View style={styles.transferRow}>
            <Ionicons name="arrow-down-outline" size={14} color="#e60023" />
            <Text style={typography.subtitle}>
              Out:{" "}
              <Text style={{ color: "#e60023", fontWeight: "700" }}>
                {playerMap[item.element_out] || "Unknown"}
              </Text>
            </Text>
          </View>

          <View style={styles.transferRow}>
            <Ionicons name="arrow-up-outline" size={14} color="#34a853" />
            <Text style={typography.subtitle}>
              In:{" "}
              <Text style={{ color: "#34a853", fontWeight: "700" }}>
                {playerMap[item.element_in] || "Unknown"}
              </Text>
            </Text>
          </View>
        </View>
      )}
      contentContainerStyle={{ padding: 6 }}
    />
  );
}

const colors = {
  gradientStart: "#fe69bb",
  gradientEnd: "#430053",
  textPrimary: "#ffffff",
  textSecondary: "#f5e6ff",
  textMuted: "#d4a9e0",
  textAccent: "#ffb6e6",
};

const typography = StyleSheet.create({
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
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
});

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff6b6b",
    fontWeight: "600",
  },
  transferCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  transferHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  transferRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
});
