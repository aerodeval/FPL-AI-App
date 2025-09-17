import { FplService } from "@/app/api/fplService";
import { Button } from "@react-navigation/elements";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function FindTeam() {
    const [teamDetails, setTeamDetails] = useState<any | null>(null);
  const [teamid, setTeamid] = useState("");
  const [loading, setLoading] = useState(true);

  return (
    <View className="flex-1 justify-center relative">
      <View className="px-5">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <View>
           
              <Text  className="text-lg my-1">
              Team Name: {teamDetails?.name}

            {teamDetails?.leagues.classic.map((league:any,index:any )=>(

                <Text key={index}>{league.name}</Text>
            ))}
              </Text>

              <Button
              className="w-10/12 rounded-mdr"
              onPress={() => router.push({
                pathname: "/screens/UserLeagues/[id]",
                params: { id: teamid },
              })
              }
            >
              Go to team
            </Button>
           
          </View>
        )}
      </View>

      <View >
        <View className="bg-slate-700 min-h-[300px]  flex items-center justify-center gap-5 px-5">
          <Text className="text-white mb-2">Enter your Team id</Text>

          <TextInput
            placeholder="6411319"
            value={teamid}
            onChangeText={(e) => setTeamid(e)}
            className="bg-white w-full p-2 rounded"
          />

          <Button
            className="w-10/12 rounded-mdr mt-3"
            onPress={async () => {
              setLoading(true);
              try {
                const data = await FplService.getEntryData(teamid);
                setTeamDetails(data);
                console.log(data);
              } catch (error) {
                console.error("Error fetching entry data:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            Search User
          </Button>
        </View>
      </View>
    </View>
  );
}
