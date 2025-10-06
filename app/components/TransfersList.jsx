import { FplService } from "@/app/api/fplService";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function TransfersList() {
  const { team_id: teamIdParam } = useLocalSearchParams();
  const route = useRoute();
  const team_id = route.params?.team_id ?? teamIdParam;

  // ✅ Fetch transfers for the team
  const {
    data: userTransfer,
    isLoading: userTransferLoading,
    error: userTransferError,
  } = useQuery({
    queryKey: ["userTransfer", team_id],
    queryFn: () => FplService.getPlayerTransfers(team_id),
    staleTime: 1000 * 60 * 10, // 10 min
  });

  // ✅ Fetch bootstrap data (for player names)
  const {
    data: bootstrapData,
    isLoading: bootstrapLoading,
    error: bootstrapError,
  } = useQuery({
    queryKey: ["bootstrap"],
    queryFn: () => FplService.getBootstrapData(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // ⏳ Loading state
  if (userTransferLoading || bootstrapLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" />
        <Text style={styles.text}>Loading transfers...</Text>
      </View>
    );
  }

  // ❌ Error handling
  if (userTransferError || bootstrapError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error fetching data</Text>
      </View>
    );
  }

  // 🧩 Map element IDs to names from bootstrap data
  const playerMap = {};
  bootstrapData?.elements?.forEach((el) => {
    playerMap[el.id] = el.web_name;
  });

  const transfers = userTransfer ?? [];

  if (transfers.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No transfers made yet</Text>
      </View>
    );
  }

  // ✅ Render each transfer
  return (
    <FlatList
      data={transfers}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.transferCard}>
          <Text style={styles.weekText}>GW {item.event}</Text>
          <Text style={styles.transferText}>
            OUT: {playerMap[item.element_out] || "Unknown"}
          </Text>
          <Text style={styles.transferText}>
            IN: {playerMap[item.element_in] || "Unknown"}
          </Text>
        </View>
      )}
      contentContainerStyle={{ padding: 8 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: "center", alignItems: "center", padding: 20 },
  text: { fontSize: 14, color: "#444" },
  errorText: { color: "red", fontWeight: "600" },
  transferCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#00E3EB",
  },
  weekText: { fontWeight: "700", marginBottom: 4 },
  transferText: { fontSize: 14, color: "#333" },
});
