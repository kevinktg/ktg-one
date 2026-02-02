import { streamText } from 'ai';

// Vercel AI Gateway - Multi-provider support with single API
// Models: anthropic/claude-opus-4.5, openai/gpt-4o, google/gemini-2.0-flash, etc.
export const maxDuration = 60;
export const runtime = 'edge';

const SYSTEM_PROMPT = `You are an advanced AI assistant integrated into .ktg's AI Tools Hub.
You specialize in:
- Prompt engineering techniques and optimization
- RAG (Retrieval-Augmented Generation) architectures
- AI system design and cognitive software engineering
- Cross-domain reasoning and creative problem solving

Be concise, technical, and insightful. Use markdown formatting when helpful.
When discussing code, provide working examples.`;

export async function POST(req) {
  try {
    const { messages, model = 'anthropic/claude-sonnet-4' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Vercel AI Gateway uses simplified model strings
    // No API keys needed when deployed on Vercel with AI Gateway enabled
    const result = streamText({
      model: model,
      messages,
      system: SYSTEM_PROMPT,
      maxTokens: 4096,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('AI Gateway Error:', error);

    // Provide helpful error for local development
    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      return new Response(
        JSON.stringify({
          error: 'AI Gateway not configured',
          hint: 'Deploy to Vercel with AI Gateway enabled, or set OPENAI_API_KEY for local development',
          docs: 'https://vercel.com/docs/ai-gateway/getting-started'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// GET endpoint for health check and available models
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ready',
      gateway: 'vercel-ai',
      models: [
        { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic' },
        { id: 'anthropic/claude-opus-4.5', name: 'Claude Opus 4.5', provider: 'Anthropic' },
        { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
        { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
        { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google' },
        { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
      ],
      docs: 'https://vercel.com/docs/ai-gateway'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
