'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Keyboard } from 'lucide-react';
import type { InterviewData } from '@/app/page';

interface InterviewSectionProps {
  data: InterviewData;
  onDataChange: (data: InterviewData) => void;
}

const DIMENSIONS = [
  {
    id: 'childhood',
    name: '童年乡土',
    icon: '👶',
    description: '儿时的村庄、玩伴、趣事',
    questions: [
      '您还记得小时候住的房子是什么样子的吗？',
      '童年时有没有特别要好的小伙伴？你们平时一起玩什么？',
      '小时候最喜欢吃什么？有没有什么难忘的味道？',
      '还记得小时候最快乐的一件事是什么吗？',
    ],
  },
  {
    id: 'farming',
    name: '农耕生活',
    icon: '🌾',
    description: '田间的劳作、农活的记忆',
    questions: [
      '您从多大开始帮家里干农活？当时都做些什么？',
      '一年四季里，哪个季节最忙？都有什么农活要干？',
      '还记得以前种过哪些庄稼吗？收成怎么样？',
      '有没有什么农耕的智慧或经验想传给后辈？',
    ],
  },
  {
    id: 'times',
    name: '时代变迁',
    icon: '📜',
    description: '亲历的大事、社会的变化',
    questions: [
      '您印象最深的时代变化是什么？',
      '以前的生活和现在有什么不一样？',
      '有没有经历过什么特别艰难的时期？是怎么熬过来的？',
      '现在的生活和以前比，您觉得最大的变化是什么？',
    ],
  },
  {
    id: 'marriage',
    name: '婚恋家庭',
    icon: '❤️',
    description: '成家立业、抚养子女',
    questions: [
      '您是怎么认识老伴的？当时是怎么走到一起的？',
      '结婚那时候是什么样子的？有没有什么特别的习俗？',
      '养育子女的过程中，有什么难忘的事吗？',
      '对子女，您有什么话想对他们说？',
    ],
  },
  {
    id: 'wisdom',
    name: '人生感悟',
    icon: '💡',
    description: '一生的智慧、对后辈的话',
    questions: [
      '回首一生，您觉得最骄傲的事情是什么？',
      '有没有什么遗憾，或者想重新来过的事？',
      '您觉得做人最重要的道理是什么？',
      '对后辈们，您有什么人生经验想分享？',
    ],
  },
  {
    id: 'customs',
    name: '乡土民俗',
    icon: '🏠',
    description: '老家的风俗、传统的记忆',
    questions: [
      '老家有什么特别的节日习俗吗？',
      '过年过节的时候，家里都会准备些什么？',
      '村里有没有什么老手艺、老传统？',
      '有没有什么方言或老话，想教给后辈？',
    ],
  },
];

export function InterviewSection({ data, onDataChange }: InterviewSectionProps) {
  const [currentDimension, setCurrentDimension] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isChatting, setIsChatting] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showBasicInfo, setShowBasicInfo] = useState(!data.basicInfo.name);
  const [tempBasicInfo, setTempBasicInfo] = useState(data.basicInfo);
  
  // Voice input states
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice'); // Default to voice mode
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup on unmount
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
    
    const average = dataArray.reduce((a: number, b: number) => a + b, 0) / dataArray.length;
    setAudioLevel(average / 255);

    animationRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Start voice recording
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
        stream.getTracks().forEach(track => track.stop());
        
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        await processVoiceAudio(audioBlob);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      analyzeAudio();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('无法访问麦克风，请确保已授予权限');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  // Process recorded audio
  const processVoiceAudio = async (audioBlob: Blob) => {
    setIsProcessingVoice(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          
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
            setUserInput(data.text);
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          alert('语音识别失败，请重试');
        } finally {
          setIsProcessingVoice(false);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error reading audio:', error);
      setIsProcessingVoice(false);
    }
  };

  const handleStartInterview = () => {
    if (tempBasicInfo.name) {
      onDataChange({ ...data, basicInfo: tempBasicInfo });
      setShowBasicInfo(false);
      setIsChatting(true);
      
      // 初始化问候语
      const greeting = `您好，${tempBasicInfo.name}老人！我是您的记忆访谈助手。今天我们聊聊天，我来帮您记录下您的人生故事。我们从"童年乡土"开始，好吗？`;
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  };

  const handleSendAnswer = async () => {
    if (!userInput.trim()) return;
    
    const userMessage = userInput.trim();
    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsStreaming(true);

    // 保存对话记录
    const newConversation = {
      dimension: DIMENSIONS[currentDimension].name,
      question: DIMENSIONS[currentDimension].questions[currentQuestion],
      answer: userMessage,
      timestamp: Date.now(),
    };
    onDataChange({
      ...data,
      conversations: [...data.conversations, newConversation],
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `你是一位温暖、耐心的访谈助手，正在和一位${data.basicInfo.name || '老人'}老人聊天。
你的任务是：
1. 用亲切、温暖的语气和老人交流
2. 根据老人的回答，适时追问，引导老人说更多细节
3. 用简单易懂的语言，不要使用复杂的专业术语
4. 表达对老人经历的尊重和理解
5. 如果老人说的内容简短，鼓励他们多说一些
6. 每次回复控制在50字以内，简洁温馨

当前访谈维度：${DIMENSIONS[currentDimension].name}
当前问题方向：${DIMENSIONS[currentDimension].questions[currentQuestion]}`,
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage },
          ],
        }),
      });

      if (!response.ok) throw new Error('请求失败');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const text = line.slice(6);
              if (text === '[DONE]') continue;
              fullResponse += text;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage?.role === 'assistant') {
                  lastMessage.content = fullResponse;
                } else {
                  newMessages.push({ role: 'assistant', content: fullResponse });
                }
                return newMessages;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('聊天出错:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我刚才走神了，您能再说一遍吗？' 
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < DIMENSIONS[currentDimension].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQ = DIMENSIONS[currentDimension].questions[currentQuestion + 1];
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `好的，那我们聊聊下一个话题。${nextQ}` 
      }]);
    } else if (currentDimension < DIMENSIONS.length - 1) {
      setCurrentDimension(currentDimension + 1);
      setCurrentQuestion(0);
      const nextDim = DIMENSIONS[currentDimension + 1];
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `接下来我们聊聊"${nextDim.name}"的话题。${nextDim.questions[0]}` 
      }]);
    } else {
      // 访谈完成
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `${data.basicInfo.name}老人，今天的访谈就到这里。感谢您分享这么多珍贵的故事和回忆！我会帮您整理成一份完整的回忆录。您可以前往"成果中心"查看和导出。` 
      }]);
    }
  };

  // 基本信息填写界面
  if (showBasicInfo) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mb-4 text-4xl">👤</div>
            <h2 className="font-serif text-2xl font-bold text-foreground">填写基本信息</h2>
            <p className="mt-2 text-muted-foreground">请录入老人的基本信息，开始访谈之旅</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                老人姓名 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={tempBasicInfo.name}
                onChange={(e) => setTempBasicInfo({ ...tempBasicInfo, name: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="请输入老人姓名"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                出生年份
              </label>
              <input
                type="text"
                value={tempBasicInfo.birthYear}
                onChange={(e) => setTempBasicInfo({ ...tempBasicInfo, birthYear: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="例如：1950年"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                家乡
              </label>
              <input
                type="text"
                value={tempBasicInfo.hometown}
                onChange={(e) => setTempBasicInfo({ ...tempBasicInfo, hometown: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="例如：山东省某村"
              />
            </div>
            
            <button
              onClick={handleStartInterview}
              disabled={!tempBasicInfo.name}
              className="w-full rounded-lg bg-primary py-4 text-lg font-medium text-primary-foreground shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              开始访谈
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 访谈进行中界面
  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6 py-6">
      {/* 左侧：维度导航 */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-6 rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold text-foreground">访谈维度</h3>
          <div className="space-y-2">
            {DIMENSIONS.map((dim, index) => (
              <button
                key={dim.id}
                onClick={() => {
                  setCurrentDimension(index);
                  setCurrentQuestion(0);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                  currentDimension === index
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="text-xl">{dim.icon}</span>
                <div>
                  <div className="font-medium">{dim.name}</div>
                  <div className="text-xs opacity-80">{dim.description}</div>
                </div>
              </button>
            ))}
          </div>
          
          {/* 进度统计 */}
          <div className="mt-6 rounded-lg bg-muted p-4">
            <div className="mb-2 text-sm font-medium text-foreground">已记录</div>
            <div className="text-3xl font-bold text-primary">
              {data.conversations.length}
            </div>
            <div className="text-xs text-muted-foreground">条对话</div>
          </div>
        </div>
      </div>

      {/* 中间：对话区域 */}
      <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card">
        {/* 当前问题提示 */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">当前问题</div>
              <div className="mt-1 font-medium text-foreground">
                {DIMENSIONS[currentDimension].questions[currentQuestion]}
              </div>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {DIMENSIONS[currentDimension].name}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                {currentQuestion + 1}/{DIMENSIONS[currentDimension].questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* 对话消息区域 */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-3">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]"></span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="border-t border-border p-4">
          {/* 模式切换 */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setInputMode('voice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                inputMode === 'voice' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span className="font-medium">语音输入</span>
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                inputMode === 'text' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Keyboard className="w-5 h-5" />
              <span className="font-medium">文字输入</span>
            </button>
          </div>

          {inputMode === 'voice' ? (
            /* 语音输入模式 */
            <div className="flex flex-col items-center py-6">
              {/* 大型语音按钮 */}
              <div className="relative">
                {/* 外圈动画 - 录音时 */}
                {isRecording && (
                  <>
                    <div 
                      className="absolute -inset-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-ping"
                    />
                    <div 
                      className="absolute -inset-4 rounded-full border-4 border-amber-400 transition-all duration-100"
                      style={{ 
                        transform: `scale(${1 + audioLevel * 0.2})`,
                        opacity: 0.3 + audioLevel * 0.4
                      }}
                    />
                  </>
                )}
                
                {/* 主按钮 */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessingVoice || isStreaming}
                  className={`
                    relative z-10
                    w-28 h-28 rounded-full
                    flex items-center justify-center
                    shadow-2xl
                    transition-all duration-300 ease-out
                    ${isRecording 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 scale-110' 
                      : 'bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-105 hover:shadow-amber-500/50'
                    }
                    ${isProcessingVoice ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    active:scale-95
                  `}
                >
                  {isProcessingVoice ? (
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </button>

                {/* 录音指示灯 */}
                {isRecording && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                )}
              </div>

              {/* 提示文字 */}
              <div className="mt-6 text-center">
                {isProcessingVoice ? (
                  <p className="text-lg font-medium text-amber-600">正在识别语音...</p>
                ) : isRecording ? (
                  <div className="text-center">
                    <p className="text-lg font-medium text-red-600 animate-pulse">正在录音...</p>
                    <p className="text-sm text-muted-foreground mt-1">点击按钮停止录音</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-medium text-amber-700">点击按钮开始语音输入</p>
                    <p className="text-sm text-muted-foreground mt-1">让老人直接说话，AI 会自动转成文字</p>
                  </div>
                )}
              </div>

              {/* 识别结果预览 */}
              {userInput && (
                <div className="mt-4 w-full max-w-md">
                  <div className="rounded-xl bg-muted p-4">
                    <p className="text-sm text-muted-foreground mb-2">识别结果：</p>
                    <p className="text-foreground">{userInput}</p>
                  </div>
                </div>
              )}

              {/* 发送按钮 */}
              {userInput && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSendAnswer}
                    disabled={isStreaming}
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                  >
                    发送回答
                  </button>
                  <button
                    onClick={() => setUserInput('')}
                    className="rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground transition-all hover:bg-muted"
                  >
                    清除
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 文字输入模式 */
            <div className="flex gap-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendAnswer();
                  }
                }}
                placeholder="请输入老人的回答..."
                className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={2}
                disabled={isStreaming}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSendAnswer}
                  disabled={!userInput.trim() || isStreaming}
                  className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  发送
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground transition-all hover:bg-muted"
                >
                  下一题
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 右侧：提示词 */}
      <div className="w-72 flex-shrink-0">
        <div className="sticky top-6 rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold text-foreground">引导提示</h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-primary/5 p-3">
              <div className="text-sm font-medium text-foreground">当前维度</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {DIMENSIONS[currentDimension].description}
              </div>
            </div>
            
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm font-medium text-foreground">可引导的话题</div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {DIMENSIONS[currentDimension].questions.slice(currentQuestion, currentQuestion + 3).map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-lg bg-accent/5 p-3">
              <div className="text-sm font-medium text-foreground">访谈技巧</div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>• 用温柔的语气引导老人</li>
                <li>• 给老人充分的思考时间</li>
                <li>• 适时追问细节</li>
                <li>• 表达对老人经历的尊重</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
