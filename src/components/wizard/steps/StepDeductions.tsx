'use client'

import type { WizardFormData } from '@/types'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
}

function RupeeInput({ label, value, onChange, helpText, max }: {
  label: string; value: number | ''; onChange: (v: number | '') => void
  helpText?: string; max?: number
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>
        {label}
      </label>
      <div className="rupee-input">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : '')}
          placeholder="0"
          min={0}
          max={max}
        />
      </div>
      {helpText && <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>{helpText}</p>}
    </div>
  )
}

const DEDUCTIONS_INFO = [
  { key: '80C', name: 'Section 80C', max: 150000, examples: 'PPF, ELSS, LIC, EPF, NSC, home loan principal, school fees' },
  { key: '80CCD', name: 'Sec 80CCD(1B)', max: 50000, examples: 'NPS contributions over and above 80C limit' },
  { key: '80D', name: 'Section 80D', max: 100000, examples: 'Health insurance premiums for self, family, parents' },
  { key: '80E', name: 'Section 80E', max: null, examples: 'Interest on education loan (no limit)' },
  { key: 'HRA', name: 'HRA Exemption', max: null, examples: 'House Rent Allowance — already factored in your Form 16' },
  { key: 'LTA', name: 'Leave Travel Allowance', max: null, examples: 'Travel within India (employer allowance)' },
]

export default function StepDeductions({ data, onChange }: Props) {
  const isOldRegime = data.taxRegime === 'old'
  const isNewRegime = data.taxRegime === 'new'

  const totalDeductions = (Number(data.deduction80C) || 0) + (Number(data.deduction80D) || 0) + (Number(data.deductionOther) || 0)
  const totalTaxPaid = (Number(data.tdsPaid) || 0) + (Number(data.advanceTaxPaid) || 0) + (Number(data.selfAssessmentTax) || 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Tax Regime */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 4, color: 'var(--ink)' }}>
          Which tax regime do you prefer? <span style={{ color: 'var(--crimson)' }}>*</span>
        </label>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14 }}>
          The AI will also analyse which regime is more beneficial for you.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            {
              value: 'new', label: 'New Regime', badge: 'Default from FY 2023-24',
              pros: ['Lower slab rates', '₹75k standard deduction (salary)', 'Rebate up to ₹7L income'],
              cons: ['No 80C/80D deductions', 'No HRA exemption'],
              color: '#169c63',
            },
            {
              value: 'old', label: 'Old Regime', badge: 'Opt-in required',
              pros: ['80C up to ₹1.5L', '80D health insurance', 'HRA, LTA, home loan interest'],
              cons: ['Higher tax slabs', 'More paperwork'],
              color: '#378add',
            },
          ].map((regime) => (
            <button
              key={regime.value}
              onClick={() => onChange({ taxRegime: regime.value as 'old' | 'new' })}
              style={{
                textAlign: 'left', padding: '16px', borderRadius: 14,
                border: `2px solid ${data.taxRegime === regime.value ? regime.color : 'var(--paper-mid)'}`,
                background: data.taxRegime === regime.value ? `${regime.color}0d` : 'white',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{regime.label}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: `${regime.color}1a`, color: regime.color,
                }}>
                  {regime.badge}
                </span>
              </div>
              {regime.pros.map((p) => (
                <div key={p} style={{ display: 'flex', gap: 6, fontSize: 12, color: '#0f6e56', marginBottom: 3 }}>
                  <span style={{ color: '#20b877' }}>✓</span>{p}
                </div>
              ))}
              {regime.cons.map((c) => (
                <div key={c} style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--ink-soft)', marginTop: 3 }}>
                  <span>×</span>{c}
                </div>
              ))}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 10 }}>
          Not sure? Select either — the AI will tell you which saves more tax.
        </p>
      </div>

      {/* Deductions (only relevant for old regime, but collect for AI) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <label style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
            Deductions & Exemptions
          </label>
          {isNewRegime && (
            <span style={{
              fontSize: 11, background: '#ffefd4', color: '#c74700',
              padding: '3px 10px', borderRadius: 10, fontWeight: 500,
            }}>
              Not applicable in New Regime
            </span>
          )}
        </div>

        {isNewRegime && (
          <div style={{
            background: '#fff8ed', border: '1px solid rgba(255,124,10,0.2)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            fontSize: 13, color: 'var(--ink-mid)',
          }}>
            <strong>New Regime note:</strong> Most deductions (80C, 80D, HRA, etc.) are not available.
            The AI will still calculate your tax correctly. You can enter values below for comparison purposes.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          <RupeeInput
            label="Section 80C Investments"
            value={data.deduction80C}
            onChange={(v) => onChange({ deduction80C: v })}
            helpText="Max ₹1,50,000 — PPF, ELSS, LIC, NSC, ELSS MF, home loan principal"
            max={150000}
          />
          <RupeeInput
            label="Section 80D (Health Insurance)"
            value={data.deduction80D}
            onChange={(v) => onChange({ deduction80D: v })}
            helpText="Self+family: up to ₹25k; parents: up to ₹25k (₹50k if senior)"
          />
          <RupeeInput
            label="Other Deductions (80E, 80G, etc.)"
            value={data.deductionOther}
            onChange={(v) => onChange({ deductionOther: v })}
            helpText="NPS (80CCD), education loan interest, donations, rent paid (80GG)"
          />
        </div>

        {/* Deductions reference */}
        <details style={{ marginTop: 14 }}>
          <summary style={{ fontSize: 13, color: 'var(--saffron)', cursor: 'pointer', fontWeight: 500 }}>
            📋 Common deduction sections reference
          </summary>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {DEDUCTIONS_INFO.map((d) => (
              <div key={d.key} style={{
                display: 'flex', gap: 12, padding: '10px 14px',
                background: 'white', borderRadius: 10, border: '1px solid var(--paper-mid)',
                fontSize: 12,
              }}>
                <span style={{ fontWeight: 700, color: 'var(--saffron)', flexShrink: 0, width: 80 }}>{d.name}</span>
                <span style={{ color: 'var(--ink-mid)' }}>
                  {d.max ? `Max ₹${d.max.toLocaleString('en-IN')} — ` : 'No limit — '}{d.examples}
                </span>
              </div>
            ))}
          </div>
        </details>

        {totalDeductions > 0 && (
          <div style={{ marginTop: 12, fontSize: 13, color: '#169c63', fontWeight: 500 }}>
            ✓ Total claimed deductions: ₹{totalDeductions.toLocaleString('en-IN')}
          </div>
        )}
      </div>

      {/* Tax Already Paid */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 4, color: 'var(--ink)' }}>
          Tax Already Paid This Year
        </label>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14 }}>
          This helps calculate whether you'll get a refund or need to pay more tax.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          <RupeeInput
            label="TDS Deducted (from Form 16/26AS)"
            value={data.tdsPaid}
            onChange={(v) => onChange({ tdsPaid: v })}
            helpText="Tax deducted at source by employer or bank"
          />
          <RupeeInput
            label="Advance Tax Paid"
            value={data.advanceTaxPaid}
            onChange={(v) => onChange({ advanceTaxPaid: v })}
            helpText="Tax paid in instalments during the financial year"
          />
          <RupeeInput
            label="Self-Assessment Tax"
            value={data.selfAssessmentTax}
            onChange={(v) => onChange({ selfAssessmentTax: v })}
            helpText="Tax paid before filing ITR (Challan 280)"
          />
        </div>
        {totalTaxPaid > 0 && (
          <div style={{ marginTop: 12, fontSize: 13, color: '#169c63', fontWeight: 500 }}>
            ✓ Total tax paid: ₹{totalTaxPaid.toLocaleString('en-IN')}
          </div>
        )}
      </div>
    </div>
  )
}
