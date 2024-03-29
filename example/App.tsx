import { StyleSheet, Text, View } from 'react-native';

import * as ExpoAudioAnalyzer from 'expo-audio-analyzer';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoAudioAnalyzer.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
