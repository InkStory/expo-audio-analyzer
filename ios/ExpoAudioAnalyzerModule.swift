import ExpoModulesCore
import AVFoundation

public class ExpoAudioAnalyzerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoAudioAnalyzer")

    AsyncFunction("getAmplitudesAsync") { (filepath: String, samples: Int?, promise: Promise) in
      // If samples is nil, default to 70
      let effectiveSamples = samples ?? 70
      self.analyzeAudioFile(at: filepath, samples: effectiveSamples) { result in
        switch result {
        case .success(let averageAmplitude):
          promise.resolve(averageAmplitude)
        case .failure(let error):
          promise.reject("AudioAnalysisError", error.localizedDescription, error)
        }
      }
    }
  }

  private func analyzeAudioFile(at filePath: String, samples: Int, completion: @escaping (Result<Float, Error>) -> Void) {
    DispatchQueue.global(qos: .userInitiated).async {
      do {
        let fileURL = URL(fileURLWithPath: filePath)
        let file = try AVAudioFile(forReading: fileURL)
        let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: file.processingFormat.sampleRate, channels: file.processingFormat.channelCount, interleaved: false)!
        let frameCount = UInt32(file.length)
        let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frameCount)!

        try file.read(into: buffer)

        guard let floatChannelData = buffer.floatChannelData else {
          completion(.failure(NSError(domain: "com.yourdomain.ExpoAudioAnalyzer", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to get channel data"])))
          return
        }

        var totalAmplitude: Float = 0
        let channelCount = Int(buffer.format.channelCount)
        let length = Int(buffer.frameLength)

        // Calculate the step to sample the requested number of amplitudes.
        let step = max(1, length / samples)

        var actualSamplesCount = 0
        for channel in 0..<channelCount {
          for frame in stride(from: 0, to: length, by: step) {
            totalAmplitude += abs(floatChannelData[channel][frame]) // Using absolute value for amplitude
            actualSamplesCount += 1
          }
        }

        // Calculate the average amplitude.
        let averageAmplitude = totalAmplitude / Float(actualSamplesCount)

        completion(.success(averageAmplitude))
      } catch {
        completion(.failure(error))
      }
    }
  }
}
