import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

interface Conversation {
  dimension: string;
  question: string;
  answer: string;
  timestamp: number;
}

interface InterviewData {
  basicInfo: {
    name: string;
    birthYear: string;
    hometown: string;
  };
  conversations: Conversation[];
}

interface MaterialData {
  photos: Array<{ url: string; description: string }>;
  videos: Array<{ url: string; description: string }>;
  voiceSamples: Array<{ url: string; duration: number }>;
}

export async function POST(request: NextRequest) {
  try {
    const { type, interviewData, materialData } = await request.json() as {
      type: string;
      interviewData: InterviewData;
      materialData: MaterialData;
    };
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 根据类型生成不同的系统提示词
    let systemPrompt = '';
    let userPrompt = '';

    const { name, birthYear, hometown } = interviewData.basicInfo;
    const conversationsText = interviewData.conversations
      .map(c => `【${c.dimension}】\n问：${c.question}\n答：${c.answer}`)
      .join('\n\n');

    switch (type) {
      case 'memoir':
        systemPrompt = `你是一位专业的传记作家，擅长将老人的口述回忆整理成优美的回忆录。
你的写作风格：
1. 温暖、真挚，充满人文关怀
2. 保留老人原汁原味的语言特色
3. 按时间线或主题组织内容
4. 使用第一人称叙述（"我"）
5. 文字流畅自然，有故事感
6. 每个章节要有小标题`;
        
        userPrompt = `请根据以下访谈记录，为${name || '老人'}撰写一份回忆录。

基本信息：
- 姓名：${name || '未提供'}
- 出生年份：${birthYear || '未提供'}
- 家乡：${hometown || '未提供'}

访谈记录：
${conversationsText}

请撰写一份完整的回忆录，包含：
1. 序言（简短介绍老人背景）
2. 童年时光
3. 农耕岁月
4. 时代变迁
5. 婚姻家庭
6. 人生感悟
7. 结语（对后辈的寄语）

每部分内容要充实，语言要温暖自然。`;
        break;

      case 'letter':
        systemPrompt = `你是一位温暖的文字工作者，擅长代老人撰写家书。
你的写作风格：
1. 亲切、真诚，像是在面对面说话
2. 语言朴实但饱含深情
3. 包含人生智慧和叮嘱
4. 充满对家人的爱
5. 传统书信格式`;
        
        userPrompt = `请根据${name || '老人'}的人生经历，以老人的口吻写一封家书给子女。

老人基本信息：
- 姓名：${name || '未提供'}
- 出生年份：${birthYear || '未提供'}
- 家乡：${hometown || '未提供'}

老人的人生故事：
${conversationsText}

请写一封温馨的家书，包含：
1. 对子女的思念和关爱
2. 人生经验的分享
3. 对子女的叮嘱和期望
4. 家族传承的心愿

用老人真实、朴实的语言，表达真挚的情感。`;
        break;

      case 'genealogy':
        systemPrompt = `你是一位家族史研究专家，擅长整理家谱资料。
你的工作：
1. 梳理家族关系
2. 记录重要家族事件
3. 整理家训家风
4. 编写家族简介`;
        
        userPrompt = `请根据${name || '老人'}的回忆，整理一份简单的家谱资料。

老人信息：
- 姓名：${name || '未提供'}
- 出生年份：${birthYear || '未提供'}
- 家乡：${hometown || '未提供'}

回忆记录：
${conversationsText}

请整理出：
1. 家族简介
2. 已知的家族成员（根据回忆中提到的）
3. 家族重要事件
4. 家训家风（从老人的话中提炼）
5. 对后辈的期望

格式清晰，便于后续补充完善。`;
        break;

      case 'family-motto':
        systemPrompt = `你是一位家族文化研究专家，擅长从老人的人生经历中提炼家风家训。
你的写作风格：
1. 语言精炼，富有哲理
2. 结合老人真实经历
3. 传承性和教育意义并重
4. 格式清晰，便于铭记`;
        
        userPrompt = `请根据${name || '老人'}的人生经历，提炼家风家训。

老人基本信息：
- 姓名：${name || '未提供'}
- 出生年份：${birthYear || '未提供'}
- 家乡：${hometown || '未提供'}

老人的人生故事：
${conversationsText}

请整理出：
1. 家训（3-5条核心家训，每条配解释）
2. 家风特点
3. 做人准则
4. 对后代的期望

语言要朴实真挚，有传承价值。`;
        break;

      case 'timeline':
        systemPrompt = `你是一位人生故事记录师，擅长整理人生重要节点。
你的工作：
1. 按时间顺序梳理人生大事
2. 提炼每个阶段的主题
3. 标注重要时刻
4. 配合照片素材`;
        
        userPrompt = `请根据${name || '老人'}的回忆，绘制一份人生时间轴。

老人信息：
- 姓名：${name || '未提供'}
- 出生年份：${birthYear || '未提供'}

人生回忆：
${conversationsText}

请按时间顺序整理出人生重要节点，格式如下：
【年份/时期】事件标题
事件描述（1-2句话）

要包含：出生、童年、青年、成家、立业、晚年等重要阶段。
每个阶段提炼出最难忘的事情。`;
        break;

      case 'family-tree':
        systemPrompt = `你是一位家族史研究专家，擅长梳理家族关系。`;
        
        userPrompt = `请根据${name || '老人'}的回忆，整理家族成员关系。

老人信息：
- 姓名：${name || '未提供'}
- 出生年份：${birthYear || '未提供'}

回忆记录：
${conversationsText}

请整理出：
1. 家族成员列表（根据回忆中提到的所有人）
2. 成员关系说明
3. 家族故事
4. 需要补充完善的信息

格式清晰，便于绘制家族树。`;
        break;

      case 'quote-poster':
        systemPrompt = `你是一位文案策划师，擅长从人生故事中提炼金句。
你的工作：
1. 提炼人生智慧金句
2. 语言简练有力
3. 富有哲理和感染力
4. 适合制作成海报`;
        
        userPrompt = `请从${name || '老人'}的人生故事中，提炼10条人生金句。

老人的人生故事：
${conversationsText}

要求：
1. 每条金句不超过20字
2. 语言朴实但富有哲理
3. 体现老人的人生智慧
4. 适合打印装裱

格式：
「金句」—— 背景/来源`;
        break;

      case 'voice-album':
        systemPrompt = `你是一位声音档案管理员，负责整理声音素材说明。`;
        
        userPrompt = `请为${name || '老人'}的声音档案编写说明文档。

已采集声音样本：${materialData.voiceSamples.length}段
声音时长：${materialData.voiceSamples.reduce((sum, v) => sum + v.duration, 0)}秒

请说明：
1. 声音档案价值说明
2. 建议的保存内容
3. 乡音方言记录建议
4. 未来可生成的音频产品`;
        break;

      case 'digital-human':
        systemPrompt = `你是一位数字人技术顾问，负责为老人生成数字人分身的说明文档。`;
        userPrompt = `请根据已采集的素材，说明如何为${name || '老人'}生成数字人分身。

已采集素材：
- 照片数量：${materialData.photos.length}张
- 视频数量：${materialData.videos.length}个
- 声音样本：${materialData.voiceSamples.length}段

请说明：
1. 数字人生成流程
2. 所需素材清单
3. 预计生成效果
4. 使用场景建议`;
        break;

      case 'blessing-video':
        systemPrompt = `你是一位视频策划师，擅长策划祝福类视频内容。`;
        
        userPrompt = `请为${name || '老人'}策划祝福视频脚本。

老人基本信息：
- 姓名：${name || '未提供'}
- 出生年份：${birthYear || '未提供'}

请策划以下场景的祝福视频脚本：
1. 生日祝寿
2. 春节祝福
3. 对子孙的寄语

每个脚本包含：
- 开场白
- 祝福语
- 结束语
（用老人的口吻，朴实真挚）`;
        break;

      default:
        systemPrompt = '你是一位专业的文字工作者。';
        userPrompt = conversationsText;
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ];

          const llmStream = client.stream(messages, {
            model: 'doubao-seed-1-8-251228',
            temperature: 0.7,
          });

          for await (const chunk of llmStream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(`data: ${text}\n\n`));
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Generate stream error:', error);
          controller.enqueue(encoder.encode(`data: 生成过程中出现问题，请稍后重试。\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: '生成服务出错，请稍后重试' },
      { status: 500 }
    );
  }
}
