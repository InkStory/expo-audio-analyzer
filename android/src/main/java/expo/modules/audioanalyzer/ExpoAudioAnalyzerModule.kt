package expo.modules.audioanalyzer

import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.AudioTrack
import android.media.AudioFormat
import android.media.AudioManager
import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import kotlin.math.abs

class ExpoAudioAnalyzerModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoAudioAnalyzer")

        AsyncFunction("getAmplitudesAsync") { filepath: String, samples: Int, promise: Promise ->
            try {
                val audioUri = Uri.parse(filepath)
                val extractor = MediaExtractor()
                extractor.setDataSource(context, audioUri, null)

                val format = extractor.getTrackFormat(0) // Assuming audio is in track 0
                val sampleRate = format.getInteger(MediaFormat.KEY_SAMPLE_RATE)
                val channelConfig = if (format.getInteger(MediaFormat.KEY_CHANNEL_COUNT) == 1) AudioFormat.CHANNEL_OUT_MONO else AudioFormat.CHANNEL_OUT_STEREO
                val audioFormat = AudioFormat.ENCODING_PCM_FLOAT

                extractor.selectTrack(0)

                val audioTrack = AudioTrack(
                    AudioManager.STREAM_MUSIC,
                    sampleRate,
                    channelConfig,
                    audioFormat,
                    AudioTrack.getMinBufferSize(sampleRate, channelConfig, audioFormat),
                    AudioTrack.MODE_STREAM
                )

                val buffer = FloatArray(1024)
                var totalRead = 0
                var done = false
                var amplitudes = mutableListOf<Float>()

                while (!done) {
                    val sampleSize = extractor.readSampleData(buffer, 0)
                    if (sampleSize < 0) {
                        done = true
                    } else {
                        if (extractor.sampleFlags and MediaExtractor.SAMPLE_FLAG_SYNC != 0) {
                            audioTrack.write(buffer, 0, sampleSize, AudioTrack.WRITE_NON_BLOCKING)
                        }
                        totalRead += sampleSize
                    }
                }

                val framesPerSample = max(1, totalRead / samples)
                for (i in 0 until samples) {
                    var sum: Float = 0.0f
                    val start = i * framesPerSample
                    val end = min(start + framesPerSample, totalRead)

                    for (index in start until end) {
                        sum += abs(buffer[index])
                    }

                    val average = sum / (end - start)
                    amplitudes.add(average)
                }

                val maxAmplitude = amplitudes.maxOrNull() ?: 1.0f
                val normalizedAmplitudes = amplitudes.map { it / maxAmplitude }

                promise.resolve(normalizedAmplitudes)
            } catch (e: Exception) {
                promise.reject("E_AUDIO_ANALYSIS_FAILED", "Failed to process audio file", e)
            }
        }
    }
}
