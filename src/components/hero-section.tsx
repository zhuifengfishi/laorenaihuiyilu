'use client';

import type { AppStep } from '@/app/page';

interface HeroSectionProps {
  onNavigate: (step: AppStep) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const features = [
    {
      key: 'interview',
      icon: '💬',
      title: 'AI智能访谈',
      subtitle: '用心倾听，记录一生',
      description: 'AI模拟亲切聊天场景，分六大维度引导老人讲述人生经历。从童年乡土到人生感悟，每一个故事都值得被铭记。',
      features: ['六大维度访谈', '智能对话引导', '实时记录整理'],
      color: 'primary',
    },
    {
      key: 'material',
      icon: '📷',
      title: '素材采集',
      subtitle: '定格时光，留存影像',
      description: '上传照片、录制视频、采集声音，为老人建立完整的数字档案。这些珍贵的素材将用于生成数字人和声音克隆。',
      features: ['照片上传', '视频录制', '声音采集'],
      color: 'accent',
    },
    {
      key: 'output',
      icon: '📚',
      title: '成果中心',
      subtitle: '一生回忆，永久珍藏',
      description: '自动生成专属回忆录、家书、家谱。电子版云端存档，实体书精美印刷，让老人的故事代代相传。',
      features: ['电子回忆录', '温馨家书', '家族家谱'],
      color: 'chart-3',
    },
  ];

  return (
    <div className="py-12">
      {/* Hero区域 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-chart-3/10 p-12 md:p-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
        
        <div className="relative text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <span>🌾</span>
            <span>乡村老人数字回忆录平台</span>
          </div>
          
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            乡音留痕<span className="text-primary">·</span>岁月永存
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            每一位乡村老人都是一座<strong className="text-foreground">活着的博物馆</strong>
            <br />
            用AI技术留存他们的人生故事，让乡土记忆永久传承
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('interview')}
              className="rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              开始访谈记录
            </button>
            <button
              onClick={() => onNavigate('material')}
              className="rounded-xl border-2 border-primary/30 bg-card px-8 py-4 text-lg font-medium text-foreground transition-all hover:border-primary hover:shadow-md"
            >
              上传素材
            </button>
          </div>
        </div>
      </section>

      {/* 功能介绍 */}
      <section className="mt-16">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-foreground">
          三大核心功能
        </h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.key}
              onClick={() => onNavigate(feature.key as AppStep)}
              className="group rounded-2xl border border-border bg-card p-8 text-left shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="mb-6 text-4xl">{feature.icon}</div>
              
              <h3 className="mb-1 text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mb-4 text-sm text-primary">{feature.subtitle}</p>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {feature.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {f}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span>立即使用</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 使用流程 */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-12">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-foreground">
          使用流程
        </h2>
        
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { step: 1, title: '填写基本信息', desc: '录入老人姓名、出生年份、家乡' },
            { step: 2, title: 'AI智能访谈', desc: '六大维度引导老人讲述人生' },
            { step: 3, title: '素材采集', desc: '上传照片、视频、录制声音' },
            { step: 4, title: '生成成果', desc: '导出回忆录、家书、家谱' },
          ].map((item, index) => (
            <div key={item.step} className="relative">
              {index < 3 && (
                <div className="absolute right-0 top-8 hidden h-0.5 w-full -translate-x-8 bg-gradient-to-r from-primary to-transparent md:block" />
              )}
              <div className="relative z-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
