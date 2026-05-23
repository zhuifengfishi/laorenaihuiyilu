'use client';

import { useState, useRef } from 'react';
import type { MaterialData } from '@/app/page';

interface MaterialSectionProps {
  data: MaterialData;
  onDataChange: (data: MaterialData) => void;
}

type UploadType = 'photo' | 'video' | 'voice';

export function MaterialSection({ data, onDataChange }: MaterialSectionProps) {
  const [activeTab, setActiveTab] = useState<UploadType>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileUpload = async (files: FileList | null, type: UploadType) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('上传失败');
        
        const result = await response.json();
        
        if (type === 'photo') {
          onDataChange({
            ...data,
            photos: [...data.photos, { url: result.url, description: '' }],
          });
        } else if (type === 'video') {
          onDataChange({
            ...data,
            videos: [...data.videos, { url: result.url, description: '' }],
          });
        }
      }
    } catch (error) {
      console.error('上传出错:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        
        // 上传音频
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice.mp3');
        formData.append('type', 'voice');
        
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) throw new Error('上传失败');
          
          const result = await response.json();
          
          onDataChange({
            ...data,
            voiceSamples: [...data.voiceSamples, { url: result.url, duration: recordingTime }],
          });
        } catch (error) {
          console.error('音频上传出错:', error);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('无法访问麦克风:', error);
      alert('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { key: 'photo', label: '照片上传', icon: '📷', description: '上传老人的照片，用于生成数字人分身' },
    { key: 'video', label: '视频上传', icon: '🎬', description: '上传老人的视频，用于数字人训练' },
    { key: 'voice', label: '声音采集', icon: '🎤', description: '录制老人的声音，用于声音克隆' },
  ];

  return (
    <div className="py-12">
      {/* 标签页切换 */}
      <div className="mb-8 flex justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as UploadType)}
            className={`flex items-center gap-2 rounded-xl px-6 py-4 text-lg font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="mx-auto max-w-4xl">
        {/* 照片上传 */}
        {activeTab === 'photo' && (
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-6 text-center">
              <div className="mb-2 text-4xl">📷</div>
              <h2 className="text-xl font-bold text-foreground">上传照片</h2>
              <p className="mt-2 text-muted-foreground">
                请上传老人的正面清晰照片，用于生成数字人分身
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-12 transition-all hover:border-primary hover:bg-primary/10"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files, 'photo')}
                className="hidden"
              />
              {uploading ? (
                <div className="text-center">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">上传中...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 text-4xl">📸</div>
                  <p className="text-lg font-medium text-foreground">点击或拖拽上传照片</p>
                  <p className="mt-2 text-sm text-muted-foreground">支持 JPG、PNG 格式，建议上传清晰的正面照</p>
                </div>
              )}
            </div>

            {/* 已上传的照片 */}
            {data.photos.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 font-semibold text-foreground">已上传的照片 ({data.photos.length})</h3>
                <div className="grid grid-cols-4 gap-4">
                  {data.photos.map((photo, index) => (
                    <div key={index} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <img
                        src={photo.url}
                        alt={`照片 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => {
                          onDataChange({
                            ...data,
                            photos: data.photos.filter((_, i) => i !== index),
                          });
                        }}
                        className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 视频上传 */}
        {activeTab === 'video' && (
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-6 text-center">
              <div className="mb-2 text-4xl">🎬</div>
              <h2 className="text-xl font-bold text-foreground">上传视频</h2>
              <p className="mt-2 text-muted-foreground">
                请上传老人的视频片段，用于训练数字人的动作和表情
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 p-12 transition-all hover:border-accent hover:bg-accent/10"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files, 'video')}
                className="hidden"
              />
              {uploading ? (
                <div className="text-center">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
                  <p className="text-muted-foreground">上传中...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 text-4xl">🎥</div>
                  <p className="text-lg font-medium text-foreground">点击或拖拽上传视频</p>
                  <p className="mt-2 text-sm text-muted-foreground">支持 MP4、MOV 格式，建议拍摄老人说话、微笑等自然动作</p>
                </div>
              )}
            </div>

            {/* 已上传的视频 */}
            {data.videos.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 font-semibold text-foreground">已上传的视频 ({data.videos.length})</h3>
                <div className="space-y-4">
                  {data.videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🎬</div>
                        <div>
                          <div className="font-medium text-foreground">视频 {index + 1}</div>
                          <div className="text-sm text-muted-foreground">已上传</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onDataChange({
                            ...data,
                            videos: data.videos.filter((_, i) => i !== index),
                          });
                        }}
                        className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 声音采集 */}
        {activeTab === 'voice' && (
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-6 text-center">
              <div className="mb-2 text-4xl">🎤</div>
              <h2 className="text-xl font-bold text-foreground">声音采集</h2>
              <p className="mt-2 text-muted-foreground">
                请录制老人的声音，用于克隆保存原声和乡音
              </p>
            </div>

            <div className="flex flex-col items-center">
              {/* 录音按钮 */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative flex h-32 w-32 items-center justify-center rounded-full transition-all ${
                  isRecording
                    ? 'bg-destructive text-white animate-pulse'
                    : 'bg-chart-3 text-white hover:scale-105'
                }`}
              >
                {isRecording ? (
                  <div className="text-center">
                    <div className="text-3xl">⏹️</div>
                    <div className="mt-1 text-sm">{formatTime(recordingTime)}</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl">🎙️</div>
                    <div className="mt-1 text-sm">点击录音</div>
                  </div>
                )}
              </button>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {isRecording
                  ? '正在录音...请让老人多说一些话，包括方言、日常用语等'
                  : '建议录制1-3分钟，让老人自然地讲述一些话题'}
              </p>

              {/* 录音提示 */}
              <div className="mt-8 rounded-xl bg-muted p-6">
                <h4 className="mb-3 font-medium text-foreground">录音建议</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 请老人用平常的语气说话，不需要刻意</li>
                  <li>• 可以聊聊家常、回忆往事、讲讲方言</li>
                  <li>• 保持环境安静，避免噪音干扰</li>
                  <li>• 建议多次录音，采集不同场景下的声音</li>
                </ul>
              </div>
            </div>

            {/* 已录制的声音 */}
            {data.voiceSamples.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 font-semibold text-foreground">已录制的声音 ({data.voiceSamples.length})</h3>
                <div className="space-y-4">
                  {data.voiceSamples.map((voice, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🔊</div>
                        <div>
                          <div className="font-medium text-foreground">录音 {index + 1}</div>
                          <div className="text-sm text-muted-foreground">时长: {formatTime(voice.duration)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <audio src={voice.url} controls className="h-8" />
                        <button
                          onClick={() => {
                            onDataChange({
                              ...data,
                              voiceSamples: data.voiceSamples.filter((_, i) => i !== index),
                            });
                          }}
                          className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 采集进度 */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">采集进度</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg bg-primary/5 p-4">
              <div className="text-3xl">📷</div>
              <div>
                <div className="text-2xl font-bold text-primary">{data.photos.length}</div>
                <div className="text-sm text-muted-foreground">张照片</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-accent/5 p-4">
              <div className="text-3xl">🎬</div>
              <div>
                <div className="text-2xl font-bold text-accent">{data.videos.length}</div>
                <div className="text-sm text-muted-foreground">个视频</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-chart-3/5 p-4">
              <div className="text-3xl">🎤</div>
              <div>
                <div className="text-2xl font-bold text-chart-3">{data.voiceSamples.length}</div>
                <div className="text-sm text-muted-foreground">段声音</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
