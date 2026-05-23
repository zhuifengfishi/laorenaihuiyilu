import { NextRequest, NextResponse } from 'next/server';
import { ASRClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { base64Data, url, format } = await request.json();

    if (!base64Data && !url) {
      return NextResponse.json(
        { error: '请提供音频数据或音频URL' },
        { status: 400 }
      );
    }

    const config = new Config();
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const client = new ASRClient(config, customHeaders);

    // Prepare the request
    const asrRequest: {
      uid: string;
      url?: string;
      base64Data?: string;
    } = {
      uid: `elder-memoir-${Date.now()}`
    };

    if (url) {
      asrRequest.url = url;
    } else if (base64Data) {
      asrRequest.base64Data = base64Data;
    }

    const result = await client.recognize(asrRequest);

    return NextResponse.json({
      success: true,
      text: result.text,
      duration: result.duration
    });

  } catch (error) {
    console.error('ASR Error:', error);
    return NextResponse.json(
      { error: '语音识别失败，请重试' },
      { status: 500 }
    );
  }
}
