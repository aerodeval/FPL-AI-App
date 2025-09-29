// app/team/[id].tsx
import { FplService } from "@/app/api/fplService";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const elementTypes = {
  1: "goalkeeper",
  2: "defender",
  3: "midfielder",
  4: "attacker",
};

export default function TeamPlayers() {
  const { team_id, gw_id } = useLocalSearchParams();
  const normalizedTeamId = Array.isArray(team_id) ? team_id[0] : team_id;
  const normalizedGwId = Array.isArray(gw_id) ? gw_id[0] : gw_id;

  const { data: userTeam, isLoading: userTeamLoading, error: userTeamError } =
    useQuery({
      queryKey: ["userTeam", normalizedTeamId, normalizedGwId],
      queryFn: () =>
        FplService.getTeamPlayers(normalizedTeamId, normalizedGwId),
      staleTime: 1000 * 6 * 8,
    });

  const { data: bootstrapData, isLoading: bootstrapLoading, error: bootstrapError } =
    useQuery({
      queryKey: ["bootstrap"],
      queryFn: () => FplService.getBootstrapData(),
      staleTime: 1000 * 60 * 10,
    });

  if (userTeamLoading || bootstrapLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading team...</Text>
      </SafeAreaView>
    );
  }

  if (userTeamError || bootstrapError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Error: {String(userTeamError || bootstrapError)}</Text>
      </SafeAreaView>
    );
  }

  const starters = userTeam.picks.filter((p: any) => p.position <= 11);
  const bench = userTeam.picks.filter((p: any) => p.position > 11);

  // Group starters by element_type
  const gk = starters.filter((p: any) => p.element_type === 1);
  const def = starters.filter((p: any) => p.element_type === 2);
  const mid = starters.filter((p: any) => p.element_type === 3);
  const att = starters.filter((p: any) => p.element_type === 4);

  const getPlayerDetails = (player: any) =>
    bootstrapData?.elements?.find((p: any) => p.id === player.element);

  const renderLine = (players: any[]) => (
    <View style={styles.line}>
      {players.map((p) => {
        const details = getPlayerDetails(p);
        if (!details) return null;
        const imageUrl = details.photo
        ? `https://resources.premierleague.com/premierleague25/photos/players/110x140/${details.photo.replace('.jpg', '.png')}`
        : 'https://resources.premierleague.com/premierleague25/photos/players/110x140/placeholder.png'; 
        console.log(details)
        return (
          <View key={p.element} style={styles.player}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.playerImage}
              resizeMode="contain"
              onError={() => console.log("Image failed:", imageUrl)}
            />
            <Text style={styles.playerName}>{details.web_name}</Text>
            <Text style={styles.playerPoints}>GW: {details.event_points}</Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20}}>
        <Text style={styles.header}>
          Entry: {normalizedTeamId} | GW: {normalizedGwId}
        </Text>

        <View  style={styles.Mainteam}>
<View style={styles.startingxi}>
        {/* Formation */}
        {renderLine(gk)}
        {renderLine(def)}
        {renderLine(mid)}
        {renderLine(att)}
        </View>
        <View style={styles.bench}>
          {bench.map((p) => {
            const details = getPlayerDetails(p);
            if (!details) return null;
            const imageUrl = `https://resources.premierleague.com/premierleague/photos/players/110x140/${details.opta_code}.png`;
            return (
              <View key={p.element} style={styles.benchPlayer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.benchImage}
                  resizeMode="contain"
                />
                <Text style={styles.benchName}>{details.web_name}</Text>
              </View>
            );
          })}
        </View></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection:"column", justifyContent:"center", backgroundColor: "#fff", paddingHorizontal: 12 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 18, marginVertical: 12, fontWeight: "bold" },
  subHeader: { fontSize: 16, marginTop: 20, marginBottom: 8 },
  line: { flexDirection: "row", justifyContent: "center", marginVertical: 8 },
  player: { alignItems: "center", marginHorizontal: 6 },
  playerImage: { minWidth: 60, height: 80, borderRadius: 4, backgroundColor: "#ddd" },
  playerName: { fontSize: 12, textAlign: "center" },
  playerPoints: { fontSize: 11, color: "#333" },
  bench: { flexDirection: "row", justifyContent: "space-around", backgroundColor:"#333", borderRadius:15, padding:15 },
  benchPlayer: { alignItems: "center" },
  benchImage: { width: 50, height: 70, borderRadius: 4 },
  benchName: { fontSize: 10, color: "#666" },
  Mainteam: {backgroundColor: "#019C44" , borderRadius:15,},
  startingxi:{ paddingLeft:15,paddingRight:15}
});
