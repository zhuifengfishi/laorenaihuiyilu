'use client';

import { useState } from 'react';
import type { InterviewData, MaterialData } from '@/app/page';

interface OutputSectionProps {
  interviewData: InterviewData;
  materialData: MaterialData;
}

type OutputType = 
  | 'memoir' 
  | 'letter' 
  | 'genealogy' 
  | 'family-motto'
  | 'timeline'
  | 'family-tree'
  | 'quote-poster'
  | 'voice-album'
  | 'digital-human'
  | 'blessing-video';

// 所有成果定义 - 直接平铺展示
const allOutputs: Array<{
  key: OutputType;
  label: string;
  icon: string;
  description: string;
  features: string[];
  badge?: string;
  category: string;
  categoryColor: string;
}> = [
  {
    key: 'memoir',
    label: '一生回忆录',
    icon: '📖',
    description: '完整记录老人一生故事，传承家族记忆',
    features: ['自动整理润色', '精美排版设计', '电子版+实体书'],
    category: '文字成果',
    categoryColor: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'letter',
    label: '温馨家书',
    icon: '✉️',
    description: '老人对家人的深情寄语和嘱托',
    features: ['个性化内容', '手写信风格', '多版本生成'],
    category: '文字成果',
    categoryColor: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'genealogy',
    label: '家族家谱',
    icon: '🌳',
    description: '记录家族血脉传承，建立世代关系',
    features: ['家族关系图', '世代传承记录', '多人协作完善'],
    category: '文字成果',
    categoryColor: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'family-motto',
    label: '家训家规',
    icon: '📜',
    description: '提炼家风家训，传承家族精神',
    features: ['人生智慧结晶', '家风传承', '后代教育'],
    badge: '新',
    category: '文字成果',
    categoryColor: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'timeline',
    label: '人生时间轴',
    icon: '⏳',
    description: '可视化展示老人一生的重要节点',
    features: ['时间线图表', '重要事件标注', '照片时间轴'],
    badge: '热门',
    category: '视觉成果',
    categoryColor: 'bg-purple-100 text-purple-700',
  },
  {
    key: 'family-tree',
    label: '家族树图谱',
    icon: '🌲',
    description: '直观展示家族成员关系',
    features: ['可视化家族树', '成员照片墙', '关系标注'],
    badge: '新',
    category: '视觉成果',
    categoryColor: 'bg-purple-100 text-purple-700',
  },
  {
    key: 'quote-poster',
    label: '人生金句海报',
    icon: '🖼️',
    description: '提炼老人智慧金句，生成精美海报',
    features: ['AI提炼金句', '精美设计', '可打印装裱'],
    badge: '热门',
    category: '视觉成果',
    categoryColor: 'bg-purple-100 text-purple-700',
  },
  {
    key: 'voice-album',
    label: '原声留声机',
    icon: '🎙️',
    description: '保存老人的原声录音，永久留存乡音',
    features: ['原声保存', '方言收录', '云端存档'],
    category: '声音成果',
    categoryColor: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'digital-human',
    label: '数字人分身',
    icon: '🤖',
    description: '基于照片视频生成1:1复刻数字人',
    features: ['形象复刻', '语音播报', '动态影像'],
    badge: '核心',
    category: '视频成果',
    categoryColor: 'bg-red-100 text-red-700',
  },
  {
    key: 'blessing-video',
    label: '祝福视频',
    icon: '🎥',
    description: '数字人生成节日祝福、生日祝福视频',
    features: ['节日祝福', '生日祝寿', '家族聚会'],
    badge: '新',
    category: '视频成果',
    categoryColor: 'bg-red-100 text-red-700',
  },
];

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

  const stats = [
    { label: '访谈对话', value: interviewData.conversations.length, icon: '💬' },
    { label: '上传照片', value: materialData.photos.length, icon: '📷' },
    { label: '上传视频', value: materialData.videos.length, icon: '🎬' },
    { label: '声音样本', value: materialData.voiceSamples.length, icon: '🎤' },
  ];

  const getOutputInfo = (key: OutputType) => {
    return allOutputs.find(o => o.key === key);
  };

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

      {/* 所有成果展示 - 直接平铺 */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-foreground">选择要生成的成果</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {allOutputs.map((output) => (
            <button
              key={output.key}
              onClick={() => setActiveOutput(output.key)}
              className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                activeOutput === output.key
                  ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* 分类标签 */}
              <span className={`absolute right-2 top-2 rounded-full px-3 py-1 text-sm font-medium ${output.categoryColor}`}>
                {output.category}
              </span>
              
              {/* 热门/新标签 */}
              {output.badge && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                  {output.badge}
                </span>
              )}
              
              <div className="mt-6 mb-3 text-4xl">{output.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-foreground">{output.label}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{output.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 生成区域 */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {getOutputInfo(activeOutput)?.icon} {getOutputInfo(activeOutput)?.label}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {getOutputInfo(activeOutput)?.description}
            </p>
          </div>
          <button
            onClick={() => handleGenerate(activeOutput)}
            disabled={isGenerating || interviewData.conversations.length === 0}
            className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="mb-2 flex justify-between text-base">
              <span className="text-muted-foreground">正在生成...</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 生成的内容 */}
        {generatedContent ? (
          <div>
            <div className="rounded-xl bg-muted p-6">
              <div className="prose prose-lg max-w-none">
                {generatedContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-lg text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleDownload('pdf')}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>📄</span>
                <span>下载电子版</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>🖨️</span>
                <span>打印输出</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  alert('已复制到剪贴板');
                }}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>📋</span>
                <span>复制内容</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
            <div className="mb-4 text-4xl">
              {getOutputInfo(activeOutput)?.icon}
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
          {getOutputInfo(activeOutput)?.features.map((feature, index) => (
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

      {/* 成果套装推荐 */}
      <div className="mt-12">
        <h3 className="mb-4 text-lg font-semibold text-foreground">🎁 成果套装推荐</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <h4 className="font-semibold text-foreground">基础套装</h4>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">家庭珍藏必备</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">回忆录</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">家书</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">家谱</span>
            </div>
          </div>

          <div className="relative rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 p-6 shadow-lg">
            <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
              🔥 推荐
            </span>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">💝</span>
              <h4 className="font-semibold text-foreground">珍藏套装</h4>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">代代相传之宝</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">回忆录</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">家书</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">家谱</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">时间轴</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">金句海报</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">原声</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <h4 className="font-semibold text-foreground">传家套装</h4>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">顶级珍藏全套</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">回忆录</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">家书</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">家谱</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">家训</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">时间轴</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">家族树</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">金句海报</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">原声</span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">数字人</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
