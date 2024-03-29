import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoAudioAnalyzerViewProps } from './ExpoAudioAnalyzer.types';

const NativeView: React.ComponentType<ExpoAudioAnalyzerViewProps> =
  requireNativeViewManager('ExpoAudioAnalyzer');

export default function ExpoAudioAnalyzerView(props: ExpoAudioAnalyzerViewProps) {
  return <NativeView {...props} />;
}
