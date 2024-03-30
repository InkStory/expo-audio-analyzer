package expo.modules.audioanalyzer

import android.media.MediaExtractor
import android.media.MediaFormat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.nio.ByteBuffer
import kotlin.math.abs

class ExpoAudioAnalyzerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoAudioAnalyzer")

    AsyncFunction("getAmplitudesAsync") { _: String, _: Int?, promise: Promise ->
      promise.reject("AudioAnalysisError", "Not implemented")
    }
  }
}
