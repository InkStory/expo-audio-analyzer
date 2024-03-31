import { Asset } from "expo-asset";

import ExpoAudioAnalyzerModule from "./ExpoAudioAnalyzerModule";

export async function getAmplitudesAsync(
  source: string | number,
  samples?: number
) {
  samples = samples || 70;

  if (typeof source === "number") {
    const asset = Asset.fromModule(source);
    await asset.downloadAsync();
    source = asset.localUri || asset.uri;
  }

  return ExpoAudioAnalyzerModule.getAmplitudesAsync(source, samples);
}
