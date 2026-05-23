import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '乡音留痕·岁月永存 - 乡村老人数字回忆录文创项目',
  description: 'AI赋能乡村老人记忆留存，打造「AI口述回忆录+数字人分身+原声克隆存档」三位一体的乡村人文数字文创产品',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero 区域 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF8F3] via-[#FFF5EB] to-[#FDF8F3] py-20 md:py-32">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-accent/20 to-primary/10 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          {/* 项目标签 */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            文创大赛参赛项目
          </div>
          
          {/* 主标题 */}
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            乡音留痕<span className="text-primary">·</span>岁月永存
          </h1>
          
          {/* 副标题 */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            AI赋能乡村老人记忆留存，让每一位乡村老人都能成为<span className="font-medium text-foreground">永久保存</span>的<span className="font-medium text-foreground">活着的乡村博物馆</span>
          </p>
          
          {/* 核心价值标签 */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {['AI口述回忆录', '数字人分身', '原声克隆存档', '乡土文化传承'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/30 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 项目背景 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              项目背景
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">乡村记忆正在消亡</h3>
              <p className="text-muted-foreground leading-relaxed">
                乡村老龄化加剧、人口外流，老一辈人的口述历史、乡土经验、独家往事正在快速消亡。每一位乡村老人都是一座<strong className="text-foreground">活着的乡村博物馆</strong>，承载着独属于本土的人文历史与生活智慧。
              </p>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">传统方式门槛高</h3>
              <p className="text-muted-foreground leading-relaxed">
                传统手写回忆录门槛高、效率低，老人提笔困难、晚辈无暇记录，大量珍贵的乡村人文素材随岁月流失，乡土文化面临<strong className="text-foreground">断层危机</strong>。
              </p>
            </div>
          </div>
          
          <div className="mt-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-8">
            <p className="text-center text-lg text-foreground">
              我们依托<strong className="text-primary">AI数字化技术</strong>，打破传统回忆录的创作壁垒，以轻量化、沉浸式、数字化的方式，留存乡村老人的一生岁月。
            </p>
          </div>
        </div>
      </section>

      {/* 核心创意 */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              核心创意
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
              打造「AI口述回忆录 + 数字人分身 + 原声克隆存档」三位一体的乡村人文数字文创产品
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* 产品1 */}
            <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-3xl font-bold text-primary-foreground shadow-lg">
                文
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">AI智能对话·一生回忆录</h3>
              <p className="mb-4 text-sm text-muted-foreground">文字文创核心</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>六大维度智能访谈，适配老人表达节奏</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>全自动整理成书，保留原汁原味语言风格</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>电子版+精装实体书双版本输出</span>
                </li>
              </ul>
            </div>
            
            {/* 产品2 */}
            <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 text-3xl font-bold text-accent-foreground shadow-lg">
                影
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">真人数字人分身·动态影像存档</h3>
              <p className="mb-4 text-sm text-muted-foreground">视觉文创核心</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>1:1复刻容貌、神态、肢体习惯</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>动态出镜、语音播报、故事讲述</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>可用于乡村文化展厅、村史馆数字展陈</span>
                </li>
              </ul>
            </div>
            
            {/* 产品3 */}
            <div className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-3 to-chart-3/70 text-3xl font-bold text-white shadow-lg">
                声
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">原声声音克隆·乡音永久留存</h3>
              <p className="mb-4 text-sm text-muted-foreground">听觉文创核心</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-chart-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>1:1还原个人原声、方言语调、说话语气</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-chart-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>搭载数字人实现自主讲故事、读回忆录</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-chart-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>留存最真实的乡村人声记忆</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 落地流程 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              落地流程
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
              轻量化、可落地、易推广的四步闭环
            </p>
          </div>
          
          <div className="relative">
            {/* 连接线 */}
            <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary via-accent to-chart-3 md:block" />
            
            <div className="space-y-8">
              {[
                { step: 1, title: '素材采集', desc: '上门轻量采集，1-2小时AI轻松对话访谈，同步拍摄人像素材、录制口述音频', icon: '🎙️', color: 'primary' },
                { step: 2, title: 'AI智能生成', desc: '后台自动完成文字整理成书、数字人建模渲染、声音克隆调试，全程无人工篡改', icon: '🤖', color: 'accent' },
                { step: 3, title: '文创成品输出', desc: '输出电子回忆录、精装实体书、动态数字人视频、原声语音档案四大成品', icon: '📚', color: 'chart-3' },
                { step: 4, title: '永久云端存档', desc: '搭建乡村老人记忆数据库，统一存档管理，打造专属乡村人文数字文创库', icon: '☁️', color: 'primary' },
              ].map((item, index) => (
                <div key={item.step} className={`flex items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                    <div className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md ${index % 2 === 1 ? 'md:ml-auto' : ''} max-w-md`}>
                      <div className="mb-2 text-2xl">{item.icon}</div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        步骤{item.step}：{item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <div className="relative z-10 hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-lg font-bold text-primary-foreground shadow-lg md:flex">
                    {item.step}
                  </div>
                  <div className="hidden flex-1 md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 文创价值与社会意义 */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              文创价值与社会意义
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: '个人与家族价值',
                subtitle: '定格一生，留存家风',
                desc: '为乡村老人完成人生总结，弥补普通人无自传的遗憾；为子女后辈留存祖辈容貌、声音、人生故事，成为代代相传的家族顶级文创纪念藏品。',
                color: 'primary',
              },
              {
                title: '乡村文化价值',
                subtitle: '抢救乡土，留存文脉',
                desc: '批量留存乡村民间历史、农耕文化、方言乡音、民俗旧事，系统化抢救碎片化乡土文化素材，打造乡村独有的人文数字IP。',
                color: 'accent',
              },
              {
                title: '文创创新价值',
                subtitle: '科技赋能，破旧立新',
                desc: '打破传统文创实物化、同质化的局限，以AI数字文创为核心，融合人文温度与前沿技术，开创「人文记忆+数字文创」的全新赛道。',
                color: 'chart-3',
              },
              {
                title: '社会公益价值',
                subtitle: '敬老暖心，人文关怀',
                desc: '以轻量化、低成本的方式关爱乡村留守老人，倾听老人一生故事，给予精神陪伴与人生认同感，是新时代敬老爱老的暖心文创公益项目。',
                color: 'chart-4',
              },
            ].map((item) => (
              <div key={item.title} className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className={`mb-4 inline-block rounded-full bg-${item.color}/10 px-3 py-1 text-xs font-medium text-${item.color}`}>
                  {item.subtitle}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 参赛核心亮点 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              参赛核心亮点
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { num: '01', title: '创意稀缺', desc: '市面无同类乡村老人全维度数字记忆文创项目，赛道新颖、差异化极强' },
              { num: '02', title: '科技赋能人文', desc: '将AI对话、数字人、声音克隆前沿技术落地乡村人文场景，落地性极强' },
              { num: '03', title: '双属性兼备', desc: '兼具文创商业价值与社会公益价值，适配文创大赛评审核心标准' },
              { num: '04', title: '永久可持续', desc: '一次采集、永久存档、可无限复用，具备规模化推广、品牌化运营的潜力' },
              { num: '05', title: '乡土温度十足', desc: '摒弃AI技术的冰冷感，聚焦平凡乡村人的一生岁月，内容真实、情感饱满', span: true },
            ].map((item) => (
              <div key={item.num} className={`group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${item.span ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <div className="mb-4 text-4xl font-bold text-primary/30">{item.num}</div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 市场化&产业化延伸 */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-chart-3/5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              市场化与产业化延伸
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '👨‍👩‍👧‍👦', title: '个人定制', desc: '面向乡村家庭、子女孝心定制，打造专属老人数字回忆录文创套装' },
              { icon: '🏛️', title: '政企合作', desc: '联动乡镇政府、村史馆、文旅单位，批量打造乡村长者记忆档案' },
              { icon: '🌾', title: '文旅文创', desc: '融入乡村文旅景区、非遗展厅，打造数字人文展陈项目' },
              { icon: '❤️', title: '公益项目', desc: '针对高龄、独居老人开展公益记忆留存计划，打造乡村暖心文创公益品牌' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h3 className="font-serif text-2xl font-bold text-foreground">乡音留痕·岁月永存</h3>
          <p className="mt-2 text-muted-foreground">让乡村岁月可触摸、可留存、可传承</p>
          <div className="mt-6 text-sm text-muted-foreground">
            文创大赛参赛项目 · AI赋能乡村老人记忆留存
          </div>
        </div>
      </footer>
    </div>
  );
}
