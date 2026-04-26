'use client'

import type { WizardFormData, AIProvider } from '@/types'
import { preScreenITRForm } from '@/data/itr-data'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
  onAnalyze: () => void
  isAnalyzing: boolean
  error: string | null
}

const AI_PROVIDERS: { value: AIProvider; name: string; model: string; icon: string; desc: string }[] = [
  { value: 'claude', name: 'Claude', model: 'claude-sonnet-4', icon: '🧠', desc: 'Best for structured tax reasoning' },
  { value: 'gemini', name: 'Gemini', model: 'gemini-2.0-flash', icon: '✦', desc: 'Fast Google AI model' },
  { value: 'openai', name: 'GPT-4o', model: 'gpt-4o', icon: '⚡', desc: 'OpenAI flagship model' },
]

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '10px 0', borderBottom: '1px solid var(--paper-mid)',
      gap: 12,
    }}>
      <span style={{ fontSize: 13, color: 'var(--ink-soft)', flexShrink: 0 }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: highlight ? 600 : 500,
        color: highlight ? 'var(--ink)' : 'var(--ink-mid)',
        textAlign: 'right',
      }}>{value}</span>
    </div>
  )
}

export default function StepReview({ data, onChange, onAnalyze, isAnalyzing, error }: Props) {
  const preScreen = preScreenITRForm(data)
  const totalIncome = Number(data.totalIncome) || 0
  const formatInr = (v: number) => v ? `₹${v.toLocaleString('en-IN')}` : '—'

  const incomeSourceLabels: Record<string, string> = {
    salary: 'Salary/Pension', house_property: 'House Property',
    business_profession: 'Business/Profession', capital_gains: 'Capital Gains',
    other_sources: 'Other Sources', foreign_income: 'Foreign Income',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Pre-screen hint */}
      {preScreen.form && (
        <div style={{
          background: 'linear-gradient(135deg, #e1f5ee, #c8eed9)',
          border: '1.5px solid rgba(32,184,119,0.3)',
          borderRadius: 14, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: '#20b877',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'white',
            flexShrink: 0,
          }}>
            {preScreen.form.replace('ITR-', '')}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#085041' }}>
              Preliminary Estimate: {preScreen.form}
            </div>
            <div style={{ fontSize: 13, color: '#0f6e56' }}>{preScreen.reason}</div>
            <div style={{ fontSize: 12, color: '#169c63', marginTop: 4 }}>
              ✨ Click &quot;Ask AI&quot; below for the definitive answer with full reasoning
            </div>
          </div>
        </div>
      )}

      {/* Summary card */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Your Profile Summary
        </h3>
        <SummaryRow label="Entity Type" value={(data.entityType || '—').replace('_', '/').toUpperCase()} highlight />
        <SummaryRow label="Residency" value={
          data.residencyStatus === 'resident' ? 'Resident Indian'
          : data.residencyStatus === 'nri' ? 'NRI'
          : data.residencyStatus === 'rnor' ? 'RNOR'
          : '—'
        } />
        {data.age && <SummaryRow label="Age" value={`${data.age} years`} />}
        <SummaryRow label="Financial Year" value={`FY ${data.financialYear}`} />
        <SummaryRow label="Income Sources" value={
          data.incomeSources.length > 0
            ? data.incomeSources.map((s) => incomeSourceLabels[s] || s).join(', ')
            : '—'
        } />
        <SummaryRow label="Gross Income" value={formatInr(totalIncome)} highlight />
        <SummaryRow label="Tax Regime" value={
          data.taxRegime === 'new' ? 'New Regime'
          : data.taxRegime === 'old' ? 'Old Regime'
          : 'Not specified (AI will suggest)'
        } />
        {(Number(data.deduction80C) || 0) + (Number(data.deduction80D) || 0) + (Number(data.deductionOther) || 0) > 0 && (
          <SummaryRow label="Total Deductions" value={formatInr(
            (Number(data.deduction80C) || 0) + (Number(data.deduction80D) || 0) + (Number(data.deductionOther) || 0)
          )} />
        )}
        {(Number(data.tdsPaid) || 0) + (Number(data.advanceTaxPaid) || 0) > 0 && (
          <SummaryRow label="Tax Already Paid" value={formatInr(
            (Number(data.tdsPaid) || 0) + (Number(data.advanceTaxPaid) || 0)
          )} />
        )}
        <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {data.hasForeignAssets && <span style={{ fontSize: 11, background: '#fff3e0', color: '#c74700', padding: '3px 8px', borderRadius: 8, fontWeight: 500 }}>Foreign Assets</span>}
          {data.hasForeignIncome && <span style={{ fontSize: 11, background: '#fff3e0', color: '#c74700', padding: '3px 8px', borderRadius: 8, fontWeight: 500 }}>Foreign Income</span>}
          {data.isDirectorInCompany && <span style={{ fontSize: 11, background: '#fff3e0', color: '#c74700', padding: '3px 8px', borderRadius: 8, fontWeight: 500 }}>Director</span>}
          {data.hasUnlistedShares && <span style={{ fontSize: 11, background: '#fff3e0', color: '#c74700', padding: '3px 8px', borderRadius: 8, fontWeight: 500 }}>Unlisted Shares</span>}
          {data.isPartnerInFirm && <span style={{ fontSize: 11, background: '#fff3e0', color: '#c74700', padding: '3px 8px', borderRadius: 8, fontWeight: 500 }}>Partner in Firm</span>}
          {data.isFirstTime && <span style={{ fontSize: 11, background: '#e1f5ee', color: '#0f6e56', padding: '3px 8px', borderRadius: 8, fontWeight: 500 }}>First-time Filer</span>}
        </div>
      </div>

      {/* AI Provider Selector */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 12, color: 'var(--ink)' }}>
          Choose your AI expert
        </label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {AI_PROVIDERS.map((p) => (
            <button
              key={p.value}
              onClick={() => onChange({ aiProvider: p.value })}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 12,
                border: `2px solid ${data.aiProvider === p.value ? 'var(--saffron)' : 'var(--paper-mid)'}`,
                background: data.aiProvider === p.value ? 'var(--saffron-light)' : 'white',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{p.model}</div>
              </div>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 8 }}>
          Make sure the API key for the chosen provider is configured in .env.local
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1.5px solid rgba(230,61,80,0.3)',
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 18 }}>❌</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#a32d2d', marginBottom: 4 }}>Analysis Failed</div>
            <div style={{ fontSize: 13, color: '#791f1f' }}>{error}</div>
            {error.includes('API key') && (
              <div style={{ fontSize: 12, color: '#a32d2d', marginTop: 6 }}>
                Add your API key to <code style={{ background: '#fee', padding: '2px 6px', borderRadius: 4 }}>.env.local</code> and restart the dev server.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main CTA */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        style={{
          width: '100%', padding: '20px', borderRadius: 16,
          background: isAnalyzing
            ? 'var(--paper-mid)'
            : 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))',
          color: isAnalyzing ? 'var(--ink-soft)' : 'white',
          border: 'none', cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          fontSize: 18, fontWeight: 700,
          fontFamily: 'var(--font-display)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          boxShadow: isAnalyzing ? 'none' : '0 8px 32px rgba(255,124,10,0.35)',
          transition: 'all 0.3s',
          letterSpacing: '0.3px',
        }}
      >
        {isAnalyzing ? (
          <>
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 20 }}>⏳</span>
            Analysing your profile...
          </>
        ) : (
          <>
            🤖 Ask AI — Find My ITR Form
          </>
        )}
      </button>

      {isAnalyzing && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>
            The AI is analysing your income profile against all ITR form criteria...
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              '📊 Evaluating income sources and amounts...',
              '🔍 Checking special scenario flags...',
              '📋 Matching against ITR-1 to ITR-7 criteria...',
              '💰 Calculating tax liability...',
              '📝 Preparing filing guidance...',
            ].map((step, i) => (
              <div key={i} style={{
                fontSize: 12, color: 'var(--ink-mid)',
                display: 'flex', alignItems: 'center', gap: 8,
                animation: `fadeIn 0.5s ease forwards`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0,
              }}>
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.6 }}>
        ⚠️ This tool provides general guidance only. Always verify with a qualified CA
        or the official <a href="https://www.incometax.gov.in" target="_blank" rel="noopener" style={{ color: 'var(--saffron)' }}>Income Tax portal</a>.
      </div>
    </div>
  )
}
