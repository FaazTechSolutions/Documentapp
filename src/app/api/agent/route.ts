import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input, options } = body;

    const url = 'https://portaldev.mawarid.com.sa:6080/platform-test-ai/agents/agent_1779168092372/text';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input || "Tell me a joke",
        options: {
          temperature: options?.temperature ?? 0.8,
          maxOutputTokens: options?.maxOutputTokens ?? 300,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: 'Agent API Error', message: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
