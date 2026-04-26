'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ITRAnalysisResult, WizardFormData } from '@/types'
import { ITR_FORMS } from '@/data/itr-data'
import ChatAssistant from './ChatAssistant'

interface Props {
  result: ITRAnalysisResult
  formData: WizardFormData
  onReset: () => void
}

function formatInr(amount: number): string {
  if (!amount && amount !== 0) return '—'
  const abs = Math.abs(amount)
  if (abs >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (abs >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function ResultsPanel({ result, formData, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<'result' | 'tax' | 'filing' | 'chat'>('result')
  const formInfo = ITR_FORMS[result.recommendedForm]

  const confidenceColor = result.confidence === 'high' ? '#169c63' : result.confidence === 'medium' ? '#ba7517' : '#993c1d'
  const confidenceBg = result.confidence === 'high' ? '#e1f5ee' : result.confidence === 'medium' ? '#faeeda' : '#faece7'

  const tax = result.taxEstimate
  const isRefund = tax?.isRefund || tax?.netPayable < 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--paper-mid)', padding: '0 24px',
        background: 'white', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--ink)' }}>
            <span>🇮🇳</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>ITR Advisor</span>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onReset} className="btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }}>
              ← Start Over
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ fontSize: 13, padding: '8px 16px' }}
            >
              🖨️ Print
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Hero Result Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--ink) 0%, #2d2a24 100%)',
          borderRadius: 24, padding: '36px 40px', marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative ring */}
          <div style={{
            position: 'absolute', right: -40, top: -40,
            width: 200, height: 200,
            border: '1px solid rgba(255,124,10,0.15)', borderRadius: '50%',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: -10, top: -10,
            width: 120, height: 120,
            border: '1px solid rgba(255,124,10,0.1)', borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: 8 }}>
                RECOMMENDED FORM
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(48px, 8vw, 72px)',
                fontWeight: 900, color: 'white',
                lineHeight: 1, marginBottom: 4,
              }}>
                {result.recommendedForm}
              </div>
              {formInfo?.name && formInfo.name !== result.recommendedForm && (
                <div style={{ fontSize: 18, color: formInfo.color, fontWeight: 600 }}>
                  {formInfo.name}
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: confidenceBg, color: confidenceColor,
                borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
                marginBottom: 12,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColor }} />
                {result.confidence.toUpperCase()} CONFIDENCE
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
                {result.eligibilitySummary}
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                  📅 <span style={{ color: 'rgba(255,255,255,0.9)' }}>{result.filingDeadline}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                  🗓️ FY {formData.financialYear}
                </div>
              </div>
            </div>

            {/* Tax summary pill */}
            {tax && (
              <div style={{
                background: isRefund ? 'rgba(32,184,119,0.15)' : 'rgba(255,124,10,0.15)',
                border: `1px solid ${isRefund ? 'rgba(32,184,119,0.3)' : 'rgba(255,124,10,0.3)'}`,
                borderRadius: 16, padding: '16px 20px', textAlign: 'center', minWidth: 150,
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', marginBottom: 6 }}>
                  {isRefund ? 'ESTIMATED REFUND' : 'TAX PAYABLE'}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28, fontWeight: 700,
                  color: isRefund ? '#5dcaa5' : '#ffc070',
                }}>
                  {formatInr(Math.abs(tax.netPayable || 0))}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {tax.regime === 'new' ? 'New Regime' : 'Old Regime'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Factors */}
        {result.keyFactors?.length > 0 && (
          <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {result.keyFactors.map((factor, i) => (
              <span key={i} style={{
                background: 'white', border: '1.5px solid var(--paper-mid)',
                borderRadius: 20, padding: '6px 14px', fontSize: 13, color: 'var(--ink-mid)',
                fontWeight: 500,
              }}>
                ✓ {factor}
              </span>
            ))}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'white', borderRadius: 14, padding: 4, border: '1px solid var(--paper-mid)' }}>
          {[
            { id: 'result', label: '📋 Analysis', tab: 'result' },
            { id: 'tax', label: '💰 Tax Estimate', tab: 'tax' },
            { id: 'filing', label: '📝 Filing Guide', tab: 'filing' },
            { id: 'chat', label: '🤖 Ask AI', tab: 'chat' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.tab as typeof activeTab)}
              style={{
                flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: activeTab === t.tab ? 'var(--saffron)' : 'transparent',
                color: activeTab === t.tab ? 'white' : 'var(--ink-mid)',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'result' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Reasoning */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
                Why {result.recommendedForm}?
              </h3>
              <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.8 }}>{result.reasoning}</p>
            </div>

            {/* Form Details */}
            {formInfo && (
              <div className="card" style={{ padding: '24px', borderLeft: `4px solid ${formInfo.color}` }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                  About {formInfo.fullName}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#169c63', marginBottom: 8 }}>✓ Eligible if you have</div>
                    {formInfo.eligibility.map((e) => (
                      <div key={e} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
                        <span style={{ color: '#20b877', flexShrink: 0 }}>•</span>{e}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#a32d2d', marginBottom: 8 }}>✗ Not applicable if</div>
                    {formInfo.notFor.map((n) => (
                      <div key={n} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-mid)', marginBottom: 6 }}>
                        <span style={{ color: '#e24b4a', flexShrink: 0 }}>•</span>{n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Alternative forms */}
            {result.alternativeForms && result.alternativeForms.length > 0 && (
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                  Alternative Forms to Consider
                </h3>
                {result.alternativeForms.map((alt) => (
                  <div key={alt.form} style={{
                    display: 'flex', gap: 12, padding: '12px', borderRadius: 10,
                    background: 'var(--paper-mid)', marginBottom: 8,
                  }}>
                    <span style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: ITR_FORMS[alt.form]?.color || '#888',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 11, flexShrink: 0,
                    }}>
                      {alt.form.replace('ITR-', '')}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{alt.form}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{alt.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Important notes */}
            {result.importantNotes?.length > 0 && (
              <div style={{
                background: '#fff8ed', border: '1.5px solid rgba(255,124,10,0.2)',
                borderRadius: 14, padding: '20px 24px',
              }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--ink)' }}>
                  ⚠️ Important Notes
                </h3>
                {result.importantNotes.map((note, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-mid)', marginBottom: 8, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--saffron)', flexShrink: 0, marginTop: 1 }}>→</span>
                    {note}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tax' && tax && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                Tax Estimate — {tax.regime === 'new' ? 'New Regime' : 'Old Regime'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>
                Approximate calculation based on your inputs. Actual tax may vary.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Gross Total Income', value: formatInr(tax.grossIncome), bold: false },
                  { label: 'Total Deductions', value: `− ${formatInr(tax.totalDeductions)}`, bold: false, color: '#169c63' },
                  { label: 'Taxable Income', value: formatInr(tax.taxableIncome), bold: true, separator: true },
                  { label: 'Income Tax (as per slabs)', value: formatInr(tax.estimatedTax), bold: false },
                  { label: 'Surcharge', value: formatInr(tax.surcharge || 0), bold: false },
                  { label: 'Health & Education Cess (4%)', value: formatInr(tax.cess || 0), bold: false },
                  { label: 'Total Tax Liability', value: formatInr(tax.totalTaxLiability), bold: true, separator: true },
                  { label: 'TDS / Advance Tax Paid', value: `− ${formatInr(tax.tdsPaid)}`, bold: false, color: '#169c63' },
                  {
                    label: isRefund ? '🎉 Estimated Refund' : '💳 Balance Tax Payable',
                    value: formatInr(Math.abs(tax.netPayable || 0)),
                    bold: true, big: true,
                    color: isRefund ? '#169c63' : '#c74700',
                  },
                ].map(({ label, value, bold, big, color, separator }, i) => (
                  <div key={i}>
                    {separator && <div style={{ height: 1, background: 'var(--paper-mid)', margin: '8px 0' }} />}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0',
                    }}>
                      <span style={{ fontSize: big ? 15 : 13, fontWeight: bold ? 700 : 400, color: 'var(--ink-mid)' }}>{label}</span>
                      <span style={{
                        fontSize: big ? 20 : 14,
                        fontWeight: bold ? 700 : 500,
                        color: color || 'var(--ink)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#e1f5ee', border: '1.5px solid rgba(32,184,119,0.3)',
              borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#085041',
            }}>
              <strong>Disclaimer:</strong> This is an indicative estimate. File your ITR on the official{' '}
              <a href="https://www.incometax.gov.in" target="_blank" rel="noopener" style={{ color: '#169c63' }}>
                Income Tax portal
              </a>{' '}
              which will auto-calculate the exact tax payable.
            </div>
          </div>
        )}

        {activeTab === 'filing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Filing Steps */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                Step-by-Step Filing Guide
              </h3>
              {result.filingSteps?.map((step) => (
                <div key={step.step} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--saffron)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14,
                  }}>
                    {step.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: 'var(--ink)' }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{step.description}</div>
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener"
                        style={{ fontSize: 12, color: 'var(--saffron)', display: 'inline-block', marginTop: 6 }}
                      >
                        {step.link} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Documents Required */}
            {result.documentsRequired?.length > 0 && (
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                  📂 Documents Checklist
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                  {result.documentsRequired.map((doc, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10, padding: '10px 14px',
                      background: 'var(--paper-mid)', borderRadius: 10,
                      fontSize: 13, color: 'var(--ink-mid)', alignItems: 'flex-start',
                    }}>
                      <span style={{ color: 'var(--saffron)', flexShrink: 0 }}>□</span>
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                🔗 Official Resources
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: 'https://www.incometax.gov.in/iec/foportal/', label: 'Income Tax e-Filing Portal' },
                  { href: 'https://www.incometax.gov.in/iec/foportal/help/e-filing-return', label: 'How to File ITR — Official Guide' },
                  { href: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1', label: 'ITR Form Selection Guide' },
                  { href: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/register-user', label: 'Register on Tax Portal' },
                  { href: 'https://www.tin-nsdl.com/', label: 'Pay Tax Online (Challan 280)' },
                ].map(({ href, label }) => (
                  <a key={href} href={href} target="_blank" rel="noopener" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 16px', borderRadius: 10,
                    border: '1.5px solid var(--paper-mid)', textDecoration: 'none',
                    color: 'var(--ink-mid)', fontSize: 14, fontWeight: 500,
                    transition: 'all 0.2s', background: 'white',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--saffron)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--paper-mid)')}
                  >
                    <span style={{ fontSize: 16 }}>🔗</span>
                    {label}
                    <span style={{ marginLeft: 'auto', color: 'var(--ink-soft)', fontSize: 12 }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <ChatAssistant result={result} formData={formData} />
        )}
      </main>
    </div>
  )
}
