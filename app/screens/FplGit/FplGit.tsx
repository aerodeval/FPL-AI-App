import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
// @ts-ignore
import Papa from "papaparse";

type Player = {
  id?: string;
  first_name?: string;
  second_name?: string;
  web_name?: string;
  team?: string;
  now_cost?: string;
  total_points?:string;
};

export default function FplGit() {
  const [data, setData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/olbauday/FPL-Elo-Insights/refs/heads/main/data/2025-2026/playerstats.csv"
        );
        const csvText = await res.text();

        const parsed = Papa.parse<Player>(csvText, { header: true });
        setData(parsed.data);
      } catch (err) {
        console.error("Error loading CSV:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCSV();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FPL Players (sample)</Text>
      <FlatList
        data={data.slice(0, 20)} // show only first 20 rows
        keyExtractor={(item, index) => (item.id ?? index.toString())}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.web_name} — Cost:{" "}
            {item.total_points}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 16, paddingVertical: 6 },
});
