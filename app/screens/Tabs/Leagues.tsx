import { FplService } from "@/app/api/fplService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTeamStore } from "../../store/useTeam";

export default function Leagues() {
  const { teamId } = useTeamStore();
  const navigation: any = useNavigation();

  useEffect(() => {
    if (!teamId) router.replace("/enter");
    console.log(userData);


    // localStorage.setItem( )
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
      <SafeAreaView className="flex-1  items-center justify-center">
        <Text className="text-white text-center">Loading leagues...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-white text-center">Failed to load leagues.</Text>
      </SafeAreaView>
    );
  }

  const leagues = userData?.leagues?.classic ?? [];

  return (
    <LinearGradient
    colors={['#8d004f',   '#430053']}
    style={{ flex: 1, paddingHorizontal: 12, justifyContent: 'center', paddingBottom:20 }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 8, backgroundColor:"" }}>
      <View style={{ width: "100%", marginTop: 4 }}>
        <Text style={typography.tagline} className="mb-3 text-left">
        {userData?.player_first_name
  ? userData.player_first_name.charAt(0).toUpperCase() + userData.player_first_name.slice(1).toLowerCase()
  : "Your"}&apos;s leagues
        </Text>

        <FlatList
          data={leagues}
          keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: any) => (
          <TouchableOpacity 
          
          onPress={() =>
            navigation.navigate("LeaguePlayers", {
              teamId: item.id,
         userId: userData?.id,
       })
     }
   >
          <View
            style={{
              padding: 12,
              borderRadius: 4,
              marginBottom: 2,
                 borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
            }}
            className="grid grid-cols-3 grid-rows-1 gap-3"
          >
     <View className="col-span-2 ">

            <Text  style={typography.title}  className="text-white-800 text-left ">{item.name}</Text>
            <View >

              <View className="flex flex-row items-center justify-between gap-4">
                <View>
              <Text   style={typography.subtitle} className="text-left">Rank</Text>
              <Text  style={typography.subtitle} className="text-black-700 text-left">{item.entry_rank}</Text></View>
              {
                item.active_phases[0].last_rank < item.entry_rank ? (
                  <View>
                  <Ionicons name="chevron-down-outline" style={styles.downButton} size={10} color={"white"} /></View>
                ):(     <View>  <Ionicons name="chevron-up-outline" size={10}  style={styles.upButton} color={"white"}  /> </View>)
              }</View>
              {/* <Button
            style={styles.button}
           onPress={() =>
             navigation.navigate("LeaguePlayers", {
               teamId: item.id,
               userId: userData?.id,
             })
           }
         >
          View</Button> */}
           
            </View></View>
    
       
          </View></TouchableOpacity>
        )}
      />
    </View>
  </ScrollView>
</LinearGradient>


  
  );



} 



const styles = StyleSheet.create({
  upButton: {
    padding: 2,
    backgroundColor: "#34a853",
    borderRadius: 20,


  },

  downButton: {
    padding: 2,
    backgroundColor: "#e60023",
    borderRadius: 20,
  },

  button: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4, // for Android
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

});



export const colors = {
  gradientStart: "#fe69bb",
  gradientEnd: "#430053",
  textPrimary: "#ffffff",
  textSecondary: "#f5e6ff",
  textMuted: "#d4a9e0",
  textAccent: "#ffb6e6",
};

export const typography = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    fontFamily: 'Inter'
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  accent: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textAccent,
  },

  tagline: {
    fontSize: 45,
    fontWeight: "400",
    color: "#f5e6ff",
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: 4,
        fontFamily: 'Jolly Lodger'
  }
});