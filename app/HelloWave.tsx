import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// import { ThemedText } from '@/components/ThemedText';

export function HelloWave() {
  const rotationAnimation = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
      4 // Run the animation 4 times
    );
  }, [rotationAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <SafeAreaView>
    <Animated.View style={styles.container}>
      <Text style={styles.heading}> Jhaat ke baal katne wali app</Text>
      <Pressable>
        <Text>Book Now </Text></Pressable>
    </Animated.View></SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container:{ flexDirection:'column',
    height:50,
    backgroundColor:"yellow"

  }
,
  heading:{
fontSize:30
  }


})


