// app/team/[id].tsx
import { FplService } from "@/app/api/fplService";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Key } from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BannerButton from './../../components/BannerButton';

const elementTypes = {
  1: "goalkeeper",
  2: "defender",
  3: "midfielder",
  4: "attacker",
};

export default function TeamPlayers() {
  const { team_id: teamIdParam, gw_id: gwIdParam } = useLocalSearchParams();
  const route = useRoute<any>();
  const team_id = (route.params as any)?.team_id ?? teamIdParam;
  const gw_id = (route.params as any)?.gw_id ?? gwIdParam;
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
            <View style={styles.playerDetail}>
            <Text style={styles.playerName}>{details.web_name}</Text>
            <Text style={styles.playerPoints}>GW: {details.event_points}</Text>
          </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20}}>
        {/* <Text style={styles.header}>
          Entry: {normalizedTeamId} | GW: {normalizedGwId}
        </Text> */}

    <BannerButton></BannerButton>

    <View style={styles.myTeam}>
<View style={styles.startingxi}>
<ImageBackground
        source={require("../../../assets/images/pitch.png")}  
        style={styles.Mainteam}
        resizeMode="contain"
      >
        {/* Formation */}
       
        
        {renderLine(att)}
        {renderLine(mid)}
        {renderLine(def)}
        {renderLine(gk)}
       
        </ImageBackground>
        </View>
        <View style={styles.bench}>
          {bench.map((p: { element: Key | null | undefined; }) => {
            const details = getPlayerDetails(p);
            if (!details) return null;
            const imageUrl = `https://resources.premierleague.com/premierleague25/photos/players/110x140/${details.photo.replace('.jpg', '.png')}`;
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
  player: { alignItems: "center", marginHorizontal: 6 ,backgroundColor: "rgba(0, 227, 235, 0.18)", borderRadius: "13px"},
  playerImage: { minWidth: 60, height: 60, borderRadius: 4,  },
  playerName: { fontSize: 12, textAlign: "center" },
  playerDetail:{ flex:1, alignItems: "center", justifyContent:"center" ,backgroundColor:"#FFF",   borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 13, width:"100%", paddingTop:3,paddingBottom:7, paddingLeft:10,paddingRight:10},
  playerPoints: { fontSize: 11, color: "#333" },
  bench: { flexDirection: "row",  width:"100%", justifyContent:"space-around", borderRadius:15, backgroundColor:"#00D595",paddingTop:24, paddingBottom:24},
  benchPlayer: { alignItems: "center" , padding:5, backgroundColor:"rgba(255,255,255,0.50)",  borderRadius: 8 ,},
  benchImage: { width: 40, height: 60, },
  benchName: { fontSize: 10, color: "#000" },
  Mainteam: { height:"100%", width:"100%" },
  startingxi:{ paddingLeft:15,paddingRight:15,flex:1,}, 
  myTeam:{ backgroundColor: "#019C44" ,borderRadius:15,overflow:"hidden"}
});
