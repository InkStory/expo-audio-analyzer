import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import * as ExpoAudioAnalyzer from "expo-audio-analyzer";

export default function App() {
  const [amplitudes, setAmplitudes] = useState([]);

  useEffect(() => {
    async function main() {
      const result = await ExpoAudioAnalyzer.getAmplitudesAsync(
        require("./assets/sound.m4a")
      );

      setAmplitudes(result);
    }

    main().catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Amplitudes: {amplitudes.join("\n")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
