'use client'

import { useState, useRef, useEffect } from 'react'
import type { ITRAnalysisResult, WizardFormData } from '@/types'

interface Props {
  result: ITRAnalysisResult
  formData: WizardFormData
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
}

const SUGGESTED_QUESTIONS = [
  'What documents do I need to file my ITR?',
  'What is the penalty if I miss the filing deadline?',
  'How do I pay any remaining tax online?',
  'Can I switch from old to new tax regime next year?',
  'How do I report capital gains in my ITR?',
  'Is my agricultural income taxable?',
]

export default function ChatAssistant({ result, formData }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I've analysed your profile and recommended **${result.recommendedForm}** for FY ${formData.financialYear}. I can answer any follow-up questions about your ITR form, filing process, tax calculation, or deductions. What would you like to know?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildContext = () => `
Taxpayer profile: Entity=${formData.entityType}, Residency=${formData.residencyStatus}, Age=${formData.age}
Income sources: ${formData.incomeSources.join(', ')}, Total income: ₹${formData.totalIncome}
Special: ForeignAssets=${formData.hasForeignAssets}, Director=${formData.isDirectorInCompany}, PartnerInFirm=${formData.isPartnerInFirm}
Tax regime preferred: ${formData.taxRegime}, TDS paid: ₹${formData.tdsPaid}
Recommended form: ${result.recommendedForm} (${result.confidence} confidence)
Tax estimate: Taxable income ₹${result.taxEstimate?.taxableIncome}, Net payable ₹${result.taxEstimate?.netPayable}
`

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMsg: Message = { role: 'user', content: text }
    const loadingMsg: Message = { role: 'assistant', content: '', loading: true }
    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setInput('')
    setIsLoading(true)

    try {
      const chatMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          context: buildContext(),
          provider: formData.aiProvider,
        }),
      })

      if (!response.ok) throw new Error('Chat request failed')

      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        // Non-streaming (Gemini fallback)
        const data = await response.json()
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: data.text || 'Sorry, I could not process that.' },
        ])
      } else {
        // Streaming (Claude / OpenAI)
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })

          // Parse SSE for Claude
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                // Claude format
                const deltaText =
                  parsed.delta?.text ||
                  // OpenAI format
                  parsed.choices?.[0]?.delta?.content ||
                  ''
                if (deltaText) {
                  accumulated += deltaText
                  setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { role: 'assistant', content: accumulated },
                  ])
                }
              } catch { /* skip malformed lines */ }
            }
          }
        }

        if (!accumulated) {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: 'Sorry, I could not generate a response. Please try again.' },
          ])
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const renderMarkdown = (text: string) => {
    // Simple markdown — bold, newlines
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 560, padding: 0, overflow: 'hidden' }}>
      {/* Chat header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--paper-mid)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--paper)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--saffron)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 18, flexShrink: 0,
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>ITR AI Assistant</div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
            Ask anything about your {result.recommendedForm} filing
          </div>
        </div>
        <div style={{
          marginLeft: 'auto', fontSize: 11,
          background: '#e1f5ee', color: '#169c63',
          padding: '3px 10px', borderRadius: 10, fontWeight: 500,
        }}>
          {formData.aiProvider === 'claude' ? '🧠 Claude' : formData.aiProvider === 'gemini' ? '✦ Gemini' : '⚡ GPT-4o'}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 8, alignItems: 'flex-end',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: 'var(--saffron)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>🤖</div>
            )}
            <div style={{
              maxWidth: '80%', padding: '12px 16px', borderRadius: 14,
              background: msg.role === 'user' ? 'var(--saffron)' : 'white',
              color: msg.role === 'user' ? 'white' : 'var(--ink)',
              fontSize: 14, lineHeight: 1.6,
              border: msg.role === 'assistant' ? '1px solid var(--paper-mid)' : 'none',
              borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
              borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 14,
            }}>
              {msg.loading ? (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-soft)',
                      animation: 'pulse 1.4s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
              )}
            </div>
            {msg.role === 'user' && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>👤</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                fontSize: 12, padding: '6px 12px', borderRadius: 16,
                border: '1.5px solid var(--paper-mid)', background: 'white',
                color: 'var(--ink-mid)', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--saffron)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--paper-mid)')}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--paper-mid)', display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Ask about your ITR filing, tax saving, deadlines..."
          disabled={isLoading}
          style={{
            flex: 1, height: 44, borderRadius: 10, border: '1.5px solid var(--paper-mid)',
            padding: '0 16px', fontSize: 14, fontFamily: 'var(--font-body)',
            outline: 'none', background: 'white', color: 'var(--ink)',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--saffron)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--paper-mid)')}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: 10, border: 'none',
            background: input.trim() && !isLoading ? 'var(--saffron)' : 'var(--paper-mid)',
            color: input.trim() && !isLoading ? 'white' : 'var(--ink-soft)',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: 18, transition: 'all 0.2s', flexShrink: 0,
          }}
        >
          {isLoading ? '⏳' : '↑'}
        </button>
      </div>
    </div>
  )
}
