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

      {/* 为什么每个老人都值得记录 */}
      <section className="mt-16">
        <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 md:p-12">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              每一位乡村老人，都值得被记录
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              他们的一生，是乡村的历史，是家族的根，是岁月的诗
            </p>
          </div>

          {/* 痛点说明 */}
          <div className="mb-10 rounded-2xl border border-amber-200 bg-white/60 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-3xl">💔</div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">时光正在流逝，记忆正在消亡</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>乡村老龄化加剧，老一辈亲历的历史、民俗、乡音正在快速消亡</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>传统手写回忆录门槛高，老人提笔困难、晚辈无暇记录</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>大量珍贵的乡土文化素材随岁月流失，乡土文化面临断层危机</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>每一位老人的离去，都是一座"乡村博物馆"的消失</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 核心价值 */}
          <div className="mb-10">
            <h3 className="mb-6 text-center font-semibold text-foreground">
              我们相信，记录一位老人，就是保存一段历史
            </h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-xl bg-white/70 p-5 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mb-3 text-3xl">👴👵</div>
                <h4 className="mb-2 font-semibold text-foreground">每位老人都珍贵</h4>
                <p className="text-sm text-muted-foreground">
                  无论贫富贵贱，每个人的一生都独一无二，值得被完整记录
                </p>
              </div>
              <div className="rounded-xl bg-white/70 p-5 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mb-3 text-3xl">📖</div>
                <h4 className="mb-2 font-semibold text-foreground">传承家风智慧</h4>
                <p className="text-sm text-muted-foreground">
                  老人的人生感悟、处世智慧，是留给子孙最宝贵的财富
                </p>
              </div>
              <div className="rounded-xl bg-white/70 p-5 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mb-3 text-3xl">🏠</div>
                <h4 className="mb-2 font-semibold text-foreground">保存乡村记忆</h4>
                <p className="text-sm text-muted-foreground">
                  农耕技艺、民俗传统、方言乡音，都藏在老人的记忆里
                </p>
              </div>
              <div className="rounded-xl bg-white/70 p-5 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mb-3 text-3xl">❤️</div>
                <h4 className="mb-2 font-semibold text-foreground">情感永恒延续</h4>
                <p className="text-sm text-muted-foreground">
                  让子孙后代能听到祖辈的声音，看到祖辈的容貌，感受祖辈的爱
                </p>
              </div>
            </div>
          </div>

          {/* 温暖的引语 */}
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <blockquote className="font-serif text-xl italic text-foreground md:text-2xl">
              "一位老人的离去，就像一座图书馆被烧毁。"
            </blockquote>
            <p className="mt-4 text-muted-foreground">
              ——非洲谚语
            </p>
            <p className="mt-4 font-medium text-primary">
              我们要做的，就是在"图书馆"消失之前，把每一本书都记录下来
            </p>
          </div>

          {/* 适合的人群 */}
          <div className="mt-8">
            <h3 className="mb-4 text-center font-semibold text-foreground">
              这个平台适合每一位乡村老人
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm">
                🌾 一辈子种地的老农民
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm">
                👵 带大几代孩子的老奶奶
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm">
                👨‍🏫 退休的乡村教师
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm">
                🏥 服务乡里几十年的赤脚医生
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm">
                🔨 掌握老手艺的匠人
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm">
                🎭 熟悉民俗传统的老人
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm">
                💪 经历过时代变迁的长者
              </span>
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm">
                👨‍👩‍👧‍👦 想给子孙留点什么的老人
              </span>
            </div>
            <p className="mt-6 text-center text-muted-foreground">
              <strong className="text-primary">无需识字、无需手写</strong>
              ，只需要开口说话，AI 帮您完成一切
            </p>
          </div>
        </div>
      </section>

      {/* 成果展示 */}
      <section className="mt-16">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            成果品展示
          </h2>
          <p className="mt-2 text-muted-foreground">
            为每一位老人打造独一无二的数字回忆录，让人生故事代代相传
          </p>
        </div>
        
        {/* 主展示区 - 精选成果 */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 回忆录展示 */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <img 
                  src="https://coze-coding-project.tos.coze.site/coze_storage_7643115594014949416/image/generate_image_0d4d7729-888e-4218-9ceb-ecd96275c710.jpeg?sign=1811096217-7a4f4d88b6-0-11d69403e54193e8d681b7f6684907e5b50cc85e34cd909b9fb55ceb4ab769a3"
                  alt="回忆录封面"
                  className="h-48 w-32 rounded-lg object-cover shadow-lg transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  <span>📚</span>
                  <span>文字成果</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">一生回忆录</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  AI自动整理润色，从童年到晚年，完整记录老人一生的重要时刻、人生感悟、家族故事。保留原汁原味的语言风格，附精美排版设计。
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">电子版云端存档</span>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">实体精装书印刷</span>
                </div>
              </div>
            </div>
          </div>

          {/* 时间轴展示 */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <img 
                  src="https://coze-coding-project.tos.coze.site/coze_storage_7643115594014949416/image/generate_image_278b54c1-ea42-4bef-a426-f1374313c732.jpeg?sign=1811096214-32fa90ce0e-0-56b6d2ffc6e9eaf45096fc8c13f90e2d4e08347e04da23b45a0469cb1356d49f"
                  alt="人生时间轴"
                  className="h-48 w-32 rounded-lg object-cover shadow-lg transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  <span>🎨</span>
                  <span>视觉成果</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">人生时间轴</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  可视化展示一生重要节点：出生、求学、工作、成家、退休...每个时刻都有专属标记，配合照片和文字说明，一目了然。
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">高清海报打印</span>
                  <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">重要时刻标注</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 成果价值说明 */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-chart-3/5 p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                💝
              </div>
              <h4 className="mb-2 font-semibold text-foreground">个人与家族价值</h4>
              <p className="text-sm text-muted-foreground">
                为老人完成人生总结，为子女留存祖辈容貌、声音、故事，成为代代相传的家族珍藏
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-2xl">
                🏘️
              </div>
              <h4 className="mb-2 font-semibold text-foreground">乡村文化价值</h4>
              <p className="text-sm text-muted-foreground">
                批量留存乡村民间历史、农耕文化、方言乡音，丰富村史馆内容，助力乡村文化振兴
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-3/10 text-2xl">
                🌟
              </div>
              <h4 className="mb-2 font-semibold text-foreground">文创创新价值</h4>
              <p className="text-sm text-muted-foreground">
                AI数字文创融合人文温度与前沿技术，开创「人文记忆+数字文创」全新赛道
              </p>
            </div>
          </div>
        </div>

        {/* 更多成果展示 */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* 家族树 */}
          <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
            <img 
              src="https://coze-coding-project.tos.coze.site/coze_storage_7643115594014949416/image/generate_image_ac6aae87-a0bc-4992-a4b1-e7499a5cecf4.jpeg?sign=1811096213-2b8e22ed02-0-d91f0d50e7410527ae94c8775445cee2afa303102b9c7e0eb7f80063912f89cc"
              alt="家族树图谱"
              className="h-40 w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="p-4">
              <h4 className="font-semibold text-foreground">家族树图谱</h4>
              <p className="mt-1 text-sm text-muted-foreground">可视化家族关系，记录世代传承</p>
            </div>
          </div>

          {/* 金句海报 */}
          <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
            <img 
              src="https://coze-coding-project.tos.coze.site/coze_storage_7643115594014949416/image/generate_image_9dcccaf0-73ad-4465-ba30-ff34b1807e48.jpeg?sign=1811096212-c4969270a5-0-744a434c9cb3ed296fa17e74bf4bc73f9ffee61b03df8e9cf4a6c2b9fcad612f"
              alt="人生金句海报"
              className="h-40 w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="p-4">
              <h4 className="font-semibold text-foreground">人生金句海报</h4>
              <p className="mt-1 text-sm text-muted-foreground">提炼智慧金句，精美设计装裱</p>
            </div>
          </div>

          {/* 数字人 */}
          <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
            <img 
              src="https://coze-coding-project.tos.coze.site/coze_storage_7643115594014949416/image/generate_image_bda7e27a-2bea-47d8-99f6-c56d088e61f0.jpeg?sign=1811096215-1846892600-0-301ad9f70a8c025842c1061ffb550ff10985b0f6ec360b5ef0046486b2852d47"
              alt="数字人分身"
              className="h-40 w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="p-4">
              <h4 className="font-semibold text-foreground">数字人分身</h4>
              <p className="mt-1 text-sm text-muted-foreground">AI复刻容貌神态，永久留存形象</p>
            </div>
          </div>
        </div>

        {/* 成果套装推荐 */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-center font-semibold text-foreground">🎁 成果套装推荐</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-dashed border-border p-4 text-center">
              <div className="mb-2 text-lg font-bold text-foreground">基础套装</div>
              <div className="text-sm text-muted-foreground">回忆录 + 家书 + 家谱</div>
              <div className="mt-2 text-xs text-muted-foreground">适合家庭珍藏</div>
            </div>
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 text-center">
              <div className="mb-1 text-xs font-medium text-primary">🔥 热门推荐</div>
              <div className="mb-2 text-lg font-bold text-foreground">珍藏套装</div>
              <div className="text-sm text-muted-foreground">基础 + 时间轴 + 金句海报 + 原声</div>
            </div>
            <div className="rounded-xl border border-dashed border-border p-4 text-center">
              <div className="mb-2 text-lg font-bold text-foreground">传家套装</div>
              <div className="text-sm text-muted-foreground">珍藏 + 数字人 + 家族树 + 家训</div>
              <div className="mt-2 text-xs text-muted-foreground">代代相传</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('interview')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <span>开始为老人记录一生</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
