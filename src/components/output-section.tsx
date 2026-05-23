'use client';

import { useState } from 'react';
import type { InterviewData, MaterialData } from '@/app/page';

interface OutputSectionProps {
  interviewData: InterviewData;
  materialData: MaterialData;
}

type OutputType = 'memoir' | 'letter' | 'genealogy' | 'digital-human';

export function OutputSection({ interviewData, materialData }: OutputSectionProps) {
  const [activeOutput, setActiveOutput] = useState<OutputType>('memoir');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [progress, setProgress] = useState(0);

  const handleGenerate = async (type: OutputType) => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedContent('');

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          interviewData,
          materialData,
        }),
      });

      if (!response.ok) throw new Error('生成失败');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';

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
              content += text;
              setGeneratedContent(content);
            }
          }
        }
      }

      setProgress(100);
    } catch (error) {
      console.error('生成出错:', error);
      alert('生成失败，请重试');
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: 'pdf' | 'word' | 'html') => {
    // 创建下载内容
    const content = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${interviewData.basicInfo.name}的回忆录</title>
          <style>
            body { font-family: 'Noto Serif SC', serif; padding: 40px; line-height: 2; }
            h1 { text-align: center; font-size: 24px; margin-bottom: 40px; }
            h2 { font-size: 18px; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            p { text-indent: 2em; margin: 15px 0; }
          </style>
        </head>
        <body>
          <h1>${interviewData.basicInfo.name}的回忆录</h1>
          ${generatedContent.split('\n').map(p => `<p>${p}</p>`).join('')}
        </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${interviewData.basicInfo.name || '老人'}的回忆录.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${interviewData.basicInfo.name}的回忆录</title>
            <style>
              body { font-family: 'Noto Serif SC', serif; padding: 40px; line-height: 2; }
              h1 { text-align: center; font-size: 24px; margin-bottom: 40px; }
              h2 { font-size: 18px; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
              p { text-indent: 2em; margin: 15px 0; }
              @media print {
                body { padding: 20mm; }
              }
            </style>
          </head>
          <body>
            <h1>${interviewData.basicInfo.name}的回忆录</h1>
            ${generatedContent.split('\n').map(p => `<p>${p}</p>`).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const outputs = [
    {
      key: 'memoir',
      label: '一生回忆录',
      icon: '📖',
      description: '根据访谈记录，自动整理生成完整的个人回忆录',
      features: ['电子版云端存档', '精美排版设计', '支持打印输出'],
    },
    {
      key: 'letter',
      label: '温馨家书',
      icon: '✉️',
      description: '老人对家人的寄语和嘱托，传承家风和人生智慧',
      features: ['个性化家书内容', '多版本生成', '手写信风格'],
    },
    {
      key: 'genealogy',
      label: '家族家谱',
      icon: '🌳',
      description: '记录家族血脉传承，建立家族关系图谱',
      features: ['家族关系图', '世代传承记录', '多人协作完善'],
    },
    {
      key: 'digital-human',
      label: '数字人分身',
      icon: '🤖',
      description: '基于照片和视频生成老人的数字人形象',
      features: ['1:1形象复刻', '语音播报能力', '动态影像展示'],
    },
  ];

  const stats = [
    { label: '访谈对话', value: interviewData.conversations.length, icon: '💬' },
    { label: '上传照片', value: materialData.photos.length, icon: '📷' },
    { label: '上传视频', value: materialData.videos.length, icon: '🎬' },
    { label: '声音样本', value: materialData.voiceSamples.length, icon: '🎤' },
  ];

  return (
    <div className="py-12">
      {/* 素材统计 */}
      <div className="mb-8 rounded-2xl border border-border bg-gradient-to-r from-primary/5 via-accent/5 to-chart-3/5 p-6">
        <h3 className="mb-4 font-semibold text-foreground">已采集素材</h3>
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-card p-4 text-center shadow-sm">
              <div className="text-2xl">{stat.icon}</div>
              <div className="mt-2 text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 输出类型选择 */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {outputs.map((output) => (
          <button
            key={output.key}
            onClick={() => setActiveOutput(output.key as OutputType)}
            className={`rounded-2xl border p-6 text-left transition-all ${
              activeOutput === output.key
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
            }`}
          >
            <div className="mb-3 text-3xl">{output.icon}</div>
            <h3 className="mb-1 font-semibold text-foreground">{output.label}</h3>
            <p className="text-xs text-muted-foreground">{output.description}</p>
          </button>
        ))}
      </div>

      {/* 生成区域 */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {outputs.find(o => o.key === activeOutput)?.label}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {outputs.find(o => o.key === activeOutput)?.description}
            </p>
          </div>
          <button
            onClick={() => handleGenerate(activeOutput)}
            disabled={isGenerating || interviewData.conversations.length === 0}
            className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                生成中...
              </span>
            ) : (
              '开始生成'
            )}
          </button>
        </div>

        {/* 进度条 */}
        {isGenerating && (
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">正在生成...</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 生成的内容 */}
        {generatedContent ? (
          <div>
            <div className="rounded-xl bg-muted p-6">
              <div className="prose prose-sm max-w-none">
                {generatedContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleDownload('pdf')}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>📄</span>
                <span>下载电子版</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>🖨️</span>
                <span>打印输出</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  alert('已复制到剪贴板');
                }}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>📋</span>
                <span>复制内容</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
            <div className="mb-4 text-4xl">
              {outputs.find(o => o.key === activeOutput)?.icon}
            </div>
            <p className="text-muted-foreground">
              {interviewData.conversations.length === 0
                ? '请先完成智能访谈，收集足够的素材后再生成成果'
                : '点击"开始生成"按钮，AI将自动为您生成内容'}
            </p>
          </div>
        )}

        {/* 功能说明 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {outputs.find(o => o.key === activeOutput)?.features.map((feature, index) => (
            <div key={index} className="rounded-lg bg-muted p-4 text-center">
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 提示信息 */}
      {interviewData.conversations.length === 0 && (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium text-foreground">还没有访谈记录</p>
              <p className="text-sm text-muted-foreground">
                请先前往"智能访谈"模块，引导老人讲述人生故事，收集素材后再生成成果
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
