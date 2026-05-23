'use client';

import { useState } from 'react';
import { InterviewSection } from '@/components/interview-section';
import { MaterialSection } from '@/components/material-section';
import { OutputSection } from '@/components/output-section';
import { HeroSection } from '@/components/hero-section';

export type AppStep = 'home' | 'interview' | 'material' | 'output';

export interface InterviewData {
  basicInfo: {
    name: string;
    birthYear: string;
    hometown: string;
  };
  conversations: Array<{
    dimension: string;
    question: string;
    answer: string;
    timestamp: number;
  }>;
}

export interface MaterialData {
  photos: Array<{ url: string; description: string }>;
  videos: Array<{ url: string; description: string }>;
  voiceSamples: Array<{ url: string; duration: number }>;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('home');
  const [interviewData, setInterviewData] = useState<InterviewData>({
    basicInfo: { name: '', birthYear: '', hometown: '' },
    conversations: [],
  });
  const [materialData, setMaterialData] = useState<MaterialData>({
    photos: [],
    videos: [],
    voiceSamples: [],
  });

  const handleNavigate = (step: AppStep) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button
            onClick={() => setCurrentStep('home')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="font-serif text-xl font-bold text-foreground">
              乡音留痕
            </span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">岁月永存</span>
          </button>
          
          <div className="flex items-center gap-1">
            {[
              { key: 'interview', label: '智能访谈', icon: '💬' },
              { key: 'material', label: '素材采集', icon: '📷' },
              { key: 'output', label: '成果中心', icon: '📚' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentStep(item.key as AppStep)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  currentStep === item.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="mx-auto max-w-7xl">
        {currentStep === 'home' && (
          <HeroSection onNavigate={handleNavigate} />
        )}
        
        {currentStep === 'interview' && (
          <InterviewSection
            data={interviewData}
            onDataChange={setInterviewData}
          />
        )}
        
        {currentStep === 'material' && (
          <MaterialSection
            data={materialData}
            onDataChange={setMaterialData}
          />
        )}
        
        {currentStep === 'output' && (
          <OutputSection
            interviewData={interviewData}
            materialData={materialData}
          />
        )}
      </main>

      {/* 底部 */}
      <footer className="mt-16 border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            AI赋能乡村老人记忆留存 · 让每一位老人的故事永久流传
          </p>
        </div>
      </footer>
    </div>
  );
}
