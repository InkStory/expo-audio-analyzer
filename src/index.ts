import { Asset } from "expo-asset";

import ExpoAudioAnalyzerModule from "./ExpoAudioAnalyzerModule";

export async function getAmplitudesAsync(
  source: string | number,
  samples?: number
) {
  samples = samples ?? 70;

  console.log(source, typeof source);

  if (typeof source === "number") {
    const asset = Asset.fromModule(source);

    console.log(asset.localUri, asset.uri);

    await asset.downloadAsync();
    source = asset.localUri || asset.uri;
  }

  return ExpoAudioAnalyzerModule.getAmplitudesAsync(source, samples);
}
