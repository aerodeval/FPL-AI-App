import { Button } from "@react-navigation/elements";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function LoginScreen(){

    return(
        <View className="flex-1 justify-end">
          <View className="bg-slate-700 min-h-[300px]  rounded-tl-[75px]  rounded-tr-[75px] flex items-center justify-center gap-5">
            
            <Button
              className="w-10/12 rounded-mdr"
              onPress={() => router.push({ pathname: "/screens/Home/HomeScreen" })}
            >
              Login
            </Button>
            <Button
              className="w-10/12"
              // onPress={() => router.push({ pathname: "/screens/Auth/SignupScreen" })}
            >
              Sign Up
            </Button>

          </View>
        </View>
    )
}

const styles= StyleSheet.create({



});


