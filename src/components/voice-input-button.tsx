'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  size?: 'default' | 'large' | 'xlarge';
  className?: string;
}

export function VoiceInputButton({ 
  onTranscript, 
  disabled = false,
  size = 'xlarge',
  className = ''
}: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Size configurations
  const sizeConfig = {
    default: { button: 'w-16 h-16', icon: 'w-6 h-6', pulse: 'w-20 h-20' },
    large: { button: 'w-24 h-24', icon: 'w-10 h-10', pulse: 'w-32 h-32' },
    xlarge: { button: 'w-32 h-32', icon: 'w-14 h-14', pulse: 'w-44 h-44' }
  };

  const config = sizeConfig[size];

  // Cleanup function
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Analyze audio level for visual feedback
  const analyzeAudio = () => {
    if (!analyserRef.current || !isRecording) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average audio level
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(average / 255); // Normalize to 0-1

    animationRef.current = requestAnimationFrame(analyzeAudio);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      streamRef.current = stream;

      // Set up audio analyzer
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        await processAudio(audioBlob);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      
      // Start analyzing audio
      analyzeAudio();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('无法访问麦克风，请确保已授予权限');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          
          // Send to ASR API
          const response = await fetch('/api/asr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              base64Data,
              format: audioBlob.type.includes('webm') ? 'webm' : 'mp4'
            })
          });

          if (!response.ok) {
            throw new Error('语音识别失败');
          }

          const data = await response.json();
          
          if (data.text) {
            onTranscript(data.text);
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          alert('语音识别失败，请重试');
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error reading audio:', error);
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isProcessing) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Calculate pulse scale based on audio level
  const pulseScale = 1 + audioLevel * 0.3;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer glow ring when recording */}
      {isRecording && (
        <div 
          className={`absolute ${config.pulse} rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-ping`}
          style={{ transform: `scale(${pulseScale})` }}
        />
      )}
      
      {/* Audio level indicator ring */}
      {isRecording && (
        <div 
          className={`absolute ${config.pulse} rounded-full border-4 border-amber-400 transition-all duration-100`}
          style={{ 
            transform: `scale(${pulseScale})`,
            opacity: 0.3 + audioLevel * 0.4
          }}
        />
      )}

      {/* Main button */}
      <button
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={`
          ${config.button}
          relative z-10
          rounded-full
          flex items-center justify-center
          transition-all duration-300 ease-out
          shadow-2xl
          ${isRecording 
            ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110' 
            : 'bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:scale-105'
          }
          ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-amber-500/50'}
          active:scale-95
        `}
      >
        {isProcessing ? (
          <Loader2 className={`${config.icon} text-white animate-spin`} />
        ) : isRecording ? (
          <MicOff className={`${config.icon} text-white`} />
        ) : (
          <Mic className={`${config.icon} text-white`} />
        )}
      </button>

      {/* Recording indicator dot */}
      {isRecording && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50">
          <span className="sr-only">录音中</span>
        </div>
      )}

      {/* Label */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
        {isProcessing ? (
          <span className="text-sm text-amber-600 font-medium">正在识别...</span>
        ) : isRecording ? (
          <span className="text-sm text-red-600 font-medium animate-pulse">录音中，点击停止</span>
        ) : (
          <span className="text-sm text-amber-700 font-medium">点击开始语音输入</span>
        )}
      </div>
    </div>
  );
}

// Floating voice input button for easy access
export function FloatingVoiceButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Expanded panel */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 bg-white rounded-2xl shadow-2xl p-6 w-72 border-2 border-amber-100">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-amber-800">语音输入</h3>
            <p className="text-sm text-amber-600 mt-1">点击下方按钮开始说话</p>
          </div>
          <div className="flex justify-center pb-8">
            <VoiceInputButton 
              onTranscript={(text) => {
                onTranscript(text);
                setIsOpen(false);
              }}
              size="large"
            />
          </div>
        </div>
      )}

      {/* Main floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full
          flex items-center justify-center
          shadow-2xl
          transition-all duration-300
          ${isOpen 
            ? 'bg-gray-600 rotate-45' 
            : 'bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
          }
        `}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <Mic className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
}
