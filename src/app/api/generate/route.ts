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
