import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoAudioAnalyzer.web.ts
// and on native platforms to ExpoAudioAnalyzer.ts
import ExpoAudioAnalyzerModule from './ExpoAudioAnalyzerModule';
import ExpoAudioAnalyzerView from './ExpoAudioAnalyzerView';
import { ChangeEventPayload, ExpoAudioAnalyzerViewProps } from './ExpoAudioAnalyzer.types';

// Get the native constant value.
export const PI = ExpoAudioAnalyzerModule.PI;

export function hello(): string {
  return ExpoAudioAnalyzerModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoAudioAnalyzerModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoAudioAnalyzerModule ?? NativeModulesProxy.ExpoAudioAnalyzer);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoAudioAnalyzerView, ExpoAudioAnalyzerViewProps, ChangeEventPayload };
