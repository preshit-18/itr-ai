import { NextRequest, NextResponse } from 'next/server'
import { analyzeITR } from '@/lib/ai-providers'
import type { WizardFormData, AIProvider } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { formData, provider = 'claude' }: { formData: WizardFormData; provider: AIProvider } = body

    if (!formData) {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 })
    }

    // Validate at least one API key is configured
    const hasKey =
      (provider === 'claude' && process.env.ANTHROPIC_API_KEY) ||
      (provider === 'gemini' && process.env.GEMINI_API_KEY) ||
      (provider === 'openai' && process.env.OPENAI_API_KEY)

    if (!hasKey) {
      return NextResponse.json(
        { error: `No API key configured for ${provider}. Please add it to .env.local` },
        { status: 500 }
      )
    }

    const result = await analyzeITR(formData, provider)
    return NextResponse.json({ success: true, result })
  } catch (error: unknown) {
    console.error('ITR Analysis error:', error)
    const message = error instanceof Error ? error.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
