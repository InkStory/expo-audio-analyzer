import * as React from 'react';

import { ExpoAudioAnalyzerViewProps } from './ExpoAudioAnalyzer.types';

export default function ExpoAudioAnalyzerView(props: ExpoAudioAnalyzerViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
