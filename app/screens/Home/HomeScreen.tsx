import { FplService } from "@/app/api/fplService";
import { getFplData } from "@/app/services/api";
import { useQuery } from "@tanstack/react-query";
import { Key, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View
} from "react-native";

export default function HomeScreen() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch fixtures with React Query
  const {
    data: fixtures,
    isLoading: fixturesLoading,
    error: fixturesError,
  } = useQuery({
    queryKey: ["fixtures"],
    queryFn: FplService.getFixtureData,
    staleTime: 1000*6*8
  });

  // Fetch players manually
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getFplData();
        const elements = Array.isArray(data?.elements)
          ? data.elements.slice(0, 5)
          : [];
        setPlayers(elements);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || fixturesLoading) return <ActivityIndicator size="large" />;
  if (fixturesError) return <Text>Error loading fixtures</Text>;

  return (
    <View className="flex-1 justify-center items-center">
      {/* Players */}
      {/* <FlatList
        data={players}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text>{item.web_name}</Text>
            {item.opta_code ? (
              <Image
                source={{
                  uri: `https://resources.premierleague.com/premierleague/photos/players/110x140/${item.opta_code}.png`,
                }}
                style={{ width: 110, height: 140 }}
              />
            ) : (
              <Text>No Image</Text>
            )}
          </View>
        )}
      /> */}

      {/* Fixtures */}
      <ScrollView style={{ padding: 10 }}>
        {fixtures?.map(
          (f: {
            id: Key | null | undefined;
            kickoff_time: string | number | Date;
            finished: any;
            team_h_score: any;
            team_a_score: any;
          }) => (
            <Text key={f.id} style={{ marginBottom: 6 }}>
              {new Date(f.kickoff_time).toLocaleString()} {"\n"}
              {f.finished
                ? `${f.team_h_score} - ${f.team_a_score}`
                : "Not started yet"}
            </Text>
          )
        )}
      </ScrollView>
    </View>
  );
}
