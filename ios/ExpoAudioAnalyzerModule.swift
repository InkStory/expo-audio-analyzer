import ExpoModulesCore
import AVFoundation

public class ExpoAudioAnalyzerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoAudioAnalyzer")

    AsyncFunction("getAmplitudesAsync") { (filepath: String, samples: Int, promise: Promise) in
      DispatchQueue.global(qos: .userInitiated).async {
        guard let audioURL = URL(string: filepath) else {
          promise.reject("E_AUDIO_ANALYSIS_FAILED", "Invalid file path")
          return
        }

        do {
          let audioFile = try AVAudioFile(forReading: audioURL)
          guard let audioPCMBuffer = AVAudioPCMBuffer(pcmFormat: audioFile.processingFormat, frameCapacity: AVAudioFrameCount(audioFile.length)) else {
            promise.reject("E_AUDIO_ANALYSIS_FAILED", "Failed to create audio buffer")
            return
          }

          try audioFile.read(into: audioPCMBuffer)

          guard let floatChannelData = audioPCMBuffer.floatChannelData else {
            promise.reject("E_AUDIO_ANALYSIS_FAILED", "Failed to get audio data")
            return
          }

          let frameLength = Int(audioPCMBuffer.frameLength)
          let framesPerSample = max(1, frameLength / samples)
          let channelData = floatChannelData[0] // Only consider the first channel
          var averagedAmplitudes = [Float]()

          for i in 0..<samples {
            var sum: Float = 0.0
            let startIndex = i * framesPerSample
            let endIndex = min(startIndex + framesPerSample, frameLength)
            let sampleCount = max(1, endIndex - startIndex) // Ensure we never divide by 0

            for frameIndex in startIndex..<endIndex {
              sum += abs(channelData[frameIndex])
            }

            let averageAmplitude = sum / Float(sampleCount)
            averagedAmplitudes.append(averageAmplitude)
          }

          // Normalize the amplitudes
          let maxAmplitude = averagedAmplitudes.max() ?? 1.0
          let normalizedAmplitudes = averagedAmplitudes.map { $0 / maxAmplitude }

          promise.resolve(normalizedAmplitudes)
        } catch {
          promise.reject("E_AUDIO_ANALYSIS_FAILED", "Error reading audio file: \(error.localizedDescription)")
        }
      }
    }
  }
}
