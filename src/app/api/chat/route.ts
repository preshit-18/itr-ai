import { NextRequest } from 'next/server'
import { streamITRChat } from '@/lib/ai-providers'
import type { AIProvider } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { messages, context, provider = 'claude' } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      context: string
      provider: AIProvider
    }

    if (provider === 'gemini') {
      // Gemini doesn't support streaming easily — use non-streaming fallback
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: messages.map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
            generationConfig: { maxOutputTokens: 1024 },
          }),
        }
      )
      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      return new Response(JSON.stringify({ text }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const stream = await streamITRChat(messages, context, provider)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(JSON.stringify({ error: 'Chat failed' }), { status: 500 })
  }
}
