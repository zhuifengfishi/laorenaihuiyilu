'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Keyboard, User, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
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
    color: 'bg-amber-100',
    description: '儿时的村庄、玩伴、趣事',
    questions: [
      '您还记得小时候住的房子是什么样子的吗？院子里有什么特别的？',
      '童年时有没有特别要好的小伙伴？你们平时一起玩什么游戏？',
      '小时候最喜欢吃什么？有没有什么难忘的味道至今还记得？',
      '还记得小时候最快乐的一天是什么时候？发生了什么事？',
      '小时候有没有挨过父母的打骂？是因为什么事？',
    ],
  },
  {
    id: 'farming',
    name: '农耕生活',
    icon: '🌾',
    color: 'bg-green-100',
    description: '田间的劳作、农活的记忆',
    questions: [
      '您从多大开始帮家里干农活？第一次下地是什么感觉？',
      '一年四季里，哪个季节最忙？您最擅长做什么农活？',
      '还记得以前种过哪些庄稼吗？哪一年收成最好？',
      '以前没有机器的时候，都是怎么干活的？有没有什么老农具？',
      '有没有什么农耕的智慧或经验想传给后辈的？',
    ],
  },
  {
    id: 'times',
    name: '时代变迁',
    icon: '📜',
    color: 'bg-stone-100',
    description: '亲历的大事、社会的变化',
    questions: [
      '您这辈子经历过哪些让您印象最深刻的大事？',
      '以前的生活和现在比，您觉得变化最大的是什么？',
      '有没有经历过什么特别艰难的时期？是怎么熬过来的？',
      '您觉得现在的生活和年轻时候比，是更好了还是更难了？',
      '如果能让年轻人了解那个年代，您最想告诉他们什么？',
    ],
  },
  {
    id: 'marriage',
    name: '婚恋家庭',
    icon: '❤️',
    color: 'bg-rose-100',
    description: '成家立业、抚养子女',
    questions: [
      '您是怎么认识老伴的？当时是谁先开口的？',
      '结婚那时候是什么样子的？有没有什么特别的习俗？',
      '养育子女的过程中，最辛苦的是什么？最欣慰的又是什么？',
      '孩子们小时候有没有做过什么让您特别感动或生气的事？',
      '如果可以重来，您对家庭生活有什么想改变的吗？',
    ],
  },
  {
    id: 'memorable',
    name: '最难忘时刻',
    icon: '⭐',
    color: 'bg-yellow-100',
    description: '人生中最难忘的事情',
    questions: [
      '您这辈子最难忘的一天是哪一天？发生了什么事？',
      '有没有什么事情，让您到现在想起来还会流泪？',
      '您最幸福的一刻是什么时候？当时是什么感受？',
      '有没有什么时刻，让您觉得这辈子值了？',
      '如果要选一件事代表您的一生，您会选哪件？',
    ],
  },
  {
    id: 'gratitude',
    name: '最想感谢的人',
    icon: '🙏',
    color: 'bg-blue-100',
    description: '恩人、贵人、想感谢的人',
    questions: [
      '您这辈子最想感谢的人是谁？他为您做过什么？',
      '有没有人在您最困难的时候帮助过您？那是怎样的情况？',
      '有没有什么话，您一直想对某个人说却没机会说？',
      '有没有什么人，您觉得这辈子亏欠了他？',
      '如果能让您再见一个人一面，您最想见谁？想对他说什么？',
    ],
  },
  {
    id: 'turning',
    name: '人生转折点',
    icon: '🔀',
    color: 'bg-purple-100',
    description: '重大选择、命运转折',
    questions: [
      '您人生中最重要的转折点是什么？当时是怎么做决定的？',
      '有没有做过什么决定，改变了您的一生？',
      '有没有什么机会，您后悔没有抓住的？',
      '如果人生能重来，您会在哪个路口做出不同的选择？',
      '您觉得命运是注定的，还是自己争取的？',
    ],
  },
  {
    id: 'proud',
    name: '最骄傲的事',
    icon: '🏆',
    color: 'bg-orange-100',
    description: '一生中最自豪的成就',
    questions: [
      '您这辈子最骄傲的事情是什么？为什么让您这么自豪？',
      '有没有什么事情，是您觉得自己做得特别好的？',
      '您觉得自己最大的优点是什么？',
      '后辈们有没有做过什么让您特别骄傲的事？',
      '如果要给年轻时的自己打分，您打几分？为什么？',
    ],
  },
  {
    id: 'regret',
    name: '遗憾与心结',
    icon: '🌙',
    color: 'bg-slate-100',
    description: '未了的心愿、放不下的事',
    questions: [
      '您这辈子有没有什么遗憾的事？',
      '有没有什么人，您想对他道歉或道谢的？',
      '有什么事情是您一直想做却没做的？',
      '有没有什么心结，到现在还没解开？',
      '如果时间能倒流，您最想改变什么？',
    ],
  },
  {
    id: 'wisdom',
    name: '人生感悟',
    icon: '💡',
    color: 'bg-teal-100',
    description: '一生的智慧、人生道理',
    questions: [
      '活了一辈子，您觉得做人最重要的道理是什么？',
      '您觉得什么是真正的幸福？',
      '有没有什么老话、俗语，您觉得特别有道理？',
      '对现在的年轻人，您有什么想提醒他们的吗？',
      '如果用一句话总结您的一生，您会说什么？',
    ],
  },
  {
    id: 'message',
    name: '对后辈的话',
    icon: '💌',
    color: 'bg-pink-100',
    description: '对子孙后代的嘱托',
    questions: [
      '您最想对孩子们说什么？有什么话一直想告诉他们？',
      '您希望后辈们记住家族的什么传统或美德？',
      '有什么人生经验，您觉得一定要传给下一代？',
      '您对孙子孙女有什么期望和祝福？',
      '如果有一天您不在了，您希望后辈们怎么记住您？',
    ],
  },
  {
    id: 'customs',
    name: '乡土民俗',
    icon: '🏠',
    color: 'bg-emerald-100',
    description: '老家的风俗、传统的记忆',
    questions: [
      '老家有什么特别的节日习俗吗？过年过节都怎么过？',
      '婚丧嫁娶在以前都有什么规矩？',
      '村里有没有什么老手艺、老传统？现在还有人会吗？',
      '有没有什么方言或老话，您想教给后辈？',
      '关于咱们村的历史，您知道哪些老故事？',
    ],
  },
];

export function InterviewSection({ data, onDataChange }: InterviewSectionProps) {
  const [currentDimension, setCurrentDimension] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  
  // 基本信息相关
  const [showBasicInfoBar, setShowBasicInfoBar] = useState(true);
  const [basicInfo, setBasicInfo] = useState(data.basicInfo);
  
  // 语音输入相关
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [activeVoiceField, setActiveVoiceField] = useState<'name' | 'birthYear' | 'hometown' | 'chat' | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  // 初始化问候语
  useEffect(() => {
    if (messages.length === 0 && basicInfo.name) {
      const greeting = `您好，${basicInfo.name}老人！我是您的记忆访谈助手。今天我们聊聊天，我来帮您记录下您的人生故事。我们从"童年乡土"开始，好吗？`;
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [basicInfo.name]);

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
  const startRecording = async (field?: 'name' | 'birthYear' | 'hometown' | 'chat') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      streamRef.current = stream;
      if (field) setActiveVoiceField(field);

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
        
        await processVoiceAudio(audioBlob, field);
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
  const processVoiceAudio = async (audioBlob: Blob, field?: 'name' | 'birthYear' | 'hometown' | 'chat') => {
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

          const result = await response.json();
          
          if (result.text) {
            if (field === 'name') {
              setBasicInfo(prev => ({ ...prev, name: result.text.trim() }));
            } else if (field === 'birthYear') {
              setBasicInfo(prev => ({ ...prev, birthYear: result.text.trim() }));
            } else if (field === 'hometown') {
              setBasicInfo(prev => ({ ...prev, hometown: result.text.trim() }));
            } else {
              // 聊天输入
              setUserInput(result.text);
            }
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          alert('语音识别失败，请重试');
        } finally {
          setIsProcessingVoice(false);
          setActiveVoiceField(null);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error reading audio:', error);
      setIsProcessingVoice(false);
      setActiveVoiceField(null);
    }
  };

  // 更新基本信息
  const handleBasicInfoChange = (field: 'name' | 'birthYear' | 'hometown', value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  // 保存基本信息并开始访谈
  const handleSaveBasicInfo = () => {
    onDataChange({ ...data, basicInfo });
    if (basicInfo.name && messages.length === 0) {
      const greeting = `您好，${basicInfo.name}老人！我是您的记忆访谈助手。今天我们聊聊天，我来帮您记录下您的人生故事。我们从"童年乡土"开始，好吗？`;
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  };

  const handleSendAnswer = async () => {
    if (!userInput.trim()) return;
    
    const userMessage = userInput.trim();
    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsStreaming(true);

    // 保存基本信息
    if (basicInfo.name) {
      onDataChange({ ...data, basicInfo });
    }

    // 保存对话记录
    const newConversation = {
      dimension: DIMENSIONS[currentDimension].name,
      question: DIMENSIONS[currentDimension].questions[currentQuestion],
      answer: userMessage,
      timestamp: Date.now(),
    };
    onDataChange({
      ...data,
      basicInfo,
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
              content: `你是一位温暖、耐心的访谈助手，正在和一位${basicInfo.name || '老人'}老人聊天。
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
        content: `${basicInfo.name}老人，今天的访谈就到这里。感谢您分享这么多珍贵的故事和回忆！我会帮您整理成一份完整的回忆录。您可以前往"成果中心"查看和导出。` 
      }]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6 py-6">
      {/* 左侧：维度导航 */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-6 rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold text-foreground">访谈维度</h3>
          <div className="space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
            {DIMENSIONS.map((dim, index) => (
              <button
                key={dim.id}
                onClick={() => {
                  setCurrentDimension(index);
                  setCurrentQuestion(0);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                  currentDimension === index
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : `${dim.color || 'hover:bg-muted'} text-muted-foreground hover:text-foreground`
                }`}
              >
                <span className="text-xl">{dim.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg">{dim.name}</div>
                  <div className="text-base opacity-70 truncate">{dim.description}</div>
                </div>
              </button>
            ))}
          </div>
          
          {/* 进度统计 */}
          <div className="mt-6 rounded-lg bg-muted p-4">
            <div className="mb-2 text-lg font-bold text-foreground">已记录</div>
            <div className="text-3xl font-bold text-primary">
              {data.conversations.length}
            </div>
            <div className="text-base text-muted-foreground">条对话</div>
          </div>
        </div>
      </div>

      {/* 中间：对话区域 */}
      <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card">
        {/* 基本信息栏 - 可折叠 */}
        <div className="border-b border-border">
          <button
            onClick={() => setShowBasicInfoBar(!showBasicInfoBar)}
            className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">
                {basicInfo.name || '点击填写基本信息'}
              </span>
              {basicInfo.birthYear && (
                <span className="text-lg text-muted-foreground">· {basicInfo.birthYear}年</span>
              )}
              {basicInfo.hometown && (
                <span className="text-lg text-muted-foreground">· {basicInfo.hometown}</span>
              )}
            </div>
            {showBasicInfoBar ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          
          {showBasicInfoBar && (
            <div className="border-t border-border bg-muted/30 p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* 姓名输入 */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={basicInfo.name}
                      onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                      placeholder="姓名"
                      className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    <button
                      onClick={() => isRecording && activeVoiceField === 'name' ? stopRecording() : startRecording('name')}
                      disabled={isRecording && activeVoiceField !== 'name'}
                      className={`
                        relative w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 flex-shrink-0
                        ${isRecording && activeVoiceField === 'name'
                          ? 'bg-gradient-to-br from-red-500 to-red-600 scale-110'
                          : 'bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-105'
                        }
                        ${isRecording && activeVoiceField !== 'name' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {isRecording && activeVoiceField === 'name' && (
                        <div className="absolute -inset-1 rounded-full bg-red-400 opacity-20 animate-ping" />
                      )}
                      <Mic className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* 出生年份输入 */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={basicInfo.birthYear}
                      onChange={(e) => handleBasicInfoChange('birthYear', e.target.value)}
                      placeholder="出生年份"
                      className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    <button
                      onClick={() => isRecording && activeVoiceField === 'birthYear' ? stopRecording() : startRecording('birthYear')}
                      disabled={isRecording && activeVoiceField !== 'birthYear'}
                      className={`
                        relative w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 flex-shrink-0
                        ${isRecording && activeVoiceField === 'birthYear'
                          ? 'bg-gradient-to-br from-red-500 to-red-600 scale-110'
                          : 'bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-105'
                        }
                        ${isRecording && activeVoiceField !== 'birthYear' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {isRecording && activeVoiceField === 'birthYear' && (
                        <div className="absolute -inset-1 rounded-full bg-red-400 opacity-20 animate-ping" />
                      )}
                      <Mic className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* 家乡输入 */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={basicInfo.hometown}
                      onChange={(e) => handleBasicInfoChange('hometown', e.target.value)}
                      placeholder="家乡"
                      className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    <button
                      onClick={() => isRecording && activeVoiceField === 'hometown' ? stopRecording() : startRecording('hometown')}
                      disabled={isRecording && activeVoiceField !== 'hometown'}
                      className={`
                        relative w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 flex-shrink-0
                        ${isRecording && activeVoiceField === 'hometown'
                          ? 'bg-gradient-to-br from-red-500 to-red-600 scale-110'
                          : 'bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-105'
                        }
                        ${isRecording && activeVoiceField !== 'hometown' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {isRecording && activeVoiceField === 'hometown' && (
                        <div className="absolute -inset-1 rounded-full bg-red-400 opacity-20 animate-ping" />
                      )}
                      <Mic className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 当前问题提示 */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg text-muted-foreground">当前问题</div>
              <div className="mt-1 font-medium text-foreground">
                {DIMENSIONS[currentDimension].questions[currentQuestion]}
              </div>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-base font-medium text-primary">
                {DIMENSIONS[currentDimension].name}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-base text-muted-foreground">
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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">👵👴</div>
              <p className="text-lg font-medium text-foreground">请先填写上方的基本信息</p>
              <p className="text-lg text-muted-foreground mt-2">填写姓名后即可开始访谈</p>
            </div>
          ) : (
            <>
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
            </>
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
                {isRecording && activeVoiceField === 'chat' && (
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
                  onClick={() => {
                    if (isRecording && activeVoiceField === 'chat') {
                      stopRecording();
                    } else {
                      startRecording('chat');
                    }
                  }}
                  disabled={isProcessingVoice || isStreaming || isRecording && activeVoiceField !== 'chat' && activeVoiceField !== null}
                  className={`
                    relative z-10
                    w-28 h-28 rounded-full
                    flex items-center justify-center
                    shadow-2xl
                    transition-all duration-300 ease-out
                    ${isRecording && activeVoiceField === 'chat'
                      ? 'bg-gradient-to-br from-red-500 to-red-600 scale-110' 
                      : 'bg-gradient-to-br from-amber-500 to-orange-500 hover:scale-105 hover:shadow-amber-500/50'
                    }
                    ${isProcessingVoice || (isRecording && activeVoiceField !== 'chat' && activeVoiceField !== null) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    active:scale-95
                  `}
                >
                  {isProcessingVoice ? (
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  ) : isRecording && activeVoiceField === 'chat' ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </button>

                {/* 录音指示灯 */}
                {isRecording && activeVoiceField === 'chat' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                )}
              </div>

              {/* 提示文字 */}
              <div className="mt-6 text-center">
                {isProcessingVoice ? (
                  <p className="text-lg font-medium text-amber-600">正在识别语音...</p>
                ) : isRecording && activeVoiceField === 'chat' ? (
                  <div className="text-center">
                    <p className="text-lg font-medium text-red-600 animate-pulse">正在录音...</p>
                    <p className="text-lg text-muted-foreground mt-1">点击按钮停止录音</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-medium text-amber-700">点击按钮开始语音输入</p>
                    <p className="text-lg text-muted-foreground mt-1">让老人直接说话，AI 会自动转成文字</p>
                  </div>
                )}
              </div>

              {/* 识别结果预览 */}
              {userInput && (
                <div className="mt-4 w-full max-w-md">
                  <div className="rounded-xl bg-muted p-4">
                    <p className="text-lg text-muted-foreground mb-2">识别结果：</p>
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
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSendAnswer}
                  disabled={!userInput.trim() || isStreaming}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                >
                  发送
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="rounded-xl border border-border bg-card px-5 py-3 text-base text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  下一题 →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
