// Import the native module. On web, it will be resolved to ExpoAudioAnalyzer.web.ts
// and on native platforms to ExpoAudioAnalyzer.ts
import ExpoAudioAnalyzerModule from "./ExpoAudioAnalyzerModule";
export async function getAmplitudesAsync(filepath: string, samples?: number) {
  return await ExpoAudioAnalyzerModule.getAmplitudesAsync(filepath, samples);
}
