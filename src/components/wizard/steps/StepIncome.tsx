'use client'

import { useEffect } from 'react'
import type { WizardFormData, IncomeSource } from '@/types'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
}

const INCOME_SOURCE_OPTIONS: { value: IncomeSource; label: string; icon: string; desc: string }[] = [
  { value: 'salary', label: 'Salary / Pension', icon: '💼', desc: 'From employer or retirement' },
  { value: 'house_property', label: 'House Property', icon: '🏠', desc: 'Rent income or deemed rent' },
  { value: 'business_profession', label: 'Business / Profession', icon: '🏪', desc: 'Self-employed, freelance, consulting' },
  { value: 'capital_gains', label: 'Capital Gains', icon: '📈', desc: 'Stocks, MFs, property sale' },
  { value: 'other_sources', label: 'Other Sources', icon: '💰', desc: 'Interest, dividends, lottery' },
  { value: 'foreign_income', label: 'Foreign Income', icon: '🌍', desc: 'Income earned abroad' },
]

function RupeeInput({
  label, value, onChange, helpText, placeholder = '0',
}: {
  label: string; value: number | ''; onChange: (v: number | '') => void
  helpText?: string; placeholder?: string
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
          placeholder={placeholder}
          min={0}
        />
      </div>
      {helpText && <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>{helpText}</p>}
    </div>
  )
}

export default function StepIncome({ data, onChange }: Props) {
  const toggleSource = (source: IncomeSource) => {
    const current = data.incomeSources
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source]
    onChange({ incomeSources: updated })
  }

  // Auto-calculate total income
  useEffect(() => {
    const total =
      (Number(data.salaryIncome) || 0) +
      (Number(data.housePropertyIncome) || 0) +
      (Number(data.businessIncome) || 0) +
      (Number(data.capitalGainsShortTerm) || 0) +
      (Number(data.capitalGainsLongTerm) || 0) +
      (Number(data.otherIncome) || 0) +
      (Number(data.foreignIncome) || 0) +
      (Number(data.agriculturalIncome) || 0)
    onChange({ totalIncome: total || '' })
  }, [
    data.salaryIncome, data.housePropertyIncome, data.businessIncome,
    data.capitalGainsShortTerm, data.capitalGainsLongTerm,
    data.otherIncome, data.foreignIncome, data.agriculturalIncome,
  ])

  const formatINR = (v: number | '') =>
    v ? `₹${Number(v).toLocaleString('en-IN')}` : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Income Sources selector */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 4, color: 'var(--ink)' }}>
          Select all your income sources <span style={{ color: 'var(--crimson)' }}>*</span>
        </label>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>
          Select all that apply for FY {data.financialYear}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
          {INCOME_SOURCE_OPTIONS.map((opt) => {
            const selected = data.incomeSources.includes(opt.value)
            return (
              <button
                key={opt.value}
                onClick={() => toggleSource(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 12, textAlign: 'left',
                  border: `2px solid ${selected ? 'var(--saffron)' : 'var(--paper-mid)'}`,
                  background: selected ? 'var(--saffron-light)' : 'white',
                  cursor: 'pointer', transition: 'all 0.2s', width: '100%',
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{opt.desc}</div>
                </div>
                {selected && <span style={{ marginLeft: 'auto', color: 'var(--saffron)', fontWeight: 700, fontSize: 14 }}>✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Income amount fields — only show selected */}
      {data.incomeSources.length > 0 && (
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 4, color: 'var(--ink)' }}>
            Enter income amounts (annual, before deductions)
          </label>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16 }}>
            Approximate values are fine — the AI will factor these in.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {data.incomeSources.includes('salary') && (
              <RupeeInput
                label="Salary / Pension"
                value={data.salaryIncome}
                onChange={(v) => onChange({ salaryIncome: v })}
                helpText="Gross salary before any deductions"
              />
            )}
            {data.incomeSources.includes('house_property') && (
              <RupeeInput
                label="House Property Income"
                value={data.housePropertyIncome}
                onChange={(v) => onChange({ housePropertyIncome: v })}
                helpText="Net annual value of rented property (can be negative)"
              />
            )}
            {data.incomeSources.includes('business_profession') && (
              <RupeeInput
                label="Business / Profession Income"
                value={data.businessIncome}
                onChange={(v) => onChange({ businessIncome: v })}
                helpText="Net profit from business or professional practice"
              />
            )}
            {data.incomeSources.includes('capital_gains') && (
              <>
                <RupeeInput
                  label="Short-Term Capital Gains"
                  value={data.capitalGainsShortTerm}
                  onChange={(v) => onChange({ capitalGainsShortTerm: v })}
                  helpText="Assets held < 1 year (equity), < 2 years (property)"
                />
                <RupeeInput
                  label="Long-Term Capital Gains"
                  value={data.capitalGainsLongTerm}
                  onChange={(v) => onChange({ capitalGainsLongTerm: v })}
                  helpText="Assets held > 1 year (equity), > 2 years (property)"
                />
              </>
            )}
            {data.incomeSources.includes('other_sources') && (
              <RupeeInput
                label="Other Sources"
                value={data.otherIncome}
                onChange={(v) => onChange({ otherIncome: v })}
                helpText="Interest, dividends, gifts, lottery winnings"
              />
            )}
            {data.incomeSources.includes('foreign_income') && (
              <RupeeInput
                label="Foreign Income (in ₹)"
                value={data.foreignIncome}
                onChange={(v) => onChange({ foreignIncome: v })}
                helpText="Convert foreign income to INR at RBI reference rate"
              />
            )}
          </div>
        </div>
      )}

      {/* Agricultural income toggle */}
      <div style={{
        border: '1.5px solid var(--paper-mid)', borderRadius: 14, padding: '16px 20px',
        background: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.hasAgriculturalIncome ? 16 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🌾</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Agricultural Income?</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Exempt if ≤ ₹5,000 but affects ITR form eligibility
              </div>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={data.hasAgriculturalIncome}
              onChange={(e) => onChange({ hasAgriculturalIncome: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
        {data.hasAgriculturalIncome && (
          <RupeeInput
            label="Agricultural Income Amount"
            value={data.agriculturalIncome}
            onChange={(v) => onChange({ agriculturalIncome: v })}
            helpText="Income from farming, plantation, nursery, etc."
          />
        )}
      </div>

      {/* Total Income Summary */}
      {Number(data.totalIncome) > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, var(--ink) 0%, #2d2a24 100%)',
          borderRadius: 16, padding: '20px 24px', color: 'white',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', marginBottom: 8 }}>
            ESTIMATED GROSS INCOME
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700 }}>
            {formatINR(data.totalIncome)}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {data.incomeSources.map((src) => {
              const amounts: Record<IncomeSource, number | ''> = {
                salary: data.salaryIncome,
                house_property: data.housePropertyIncome,
                business_profession: data.businessIncome,
                capital_gains: (Number(data.capitalGainsShortTerm) || 0) + (Number(data.capitalGainsLongTerm) || 0) || '',
                other_sources: data.otherIncome,
                foreign_income: data.foreignIncome,
              }
              const label: Record<IncomeSource, string> = {
                salary: 'Salary', house_property: 'House Prop.', business_profession: 'Business',
                capital_gains: 'Cap. Gains', other_sources: 'Other', foreign_income: 'Foreign',
              }
              const amt = amounts[src]
              if (!amt) return null
              return (
                <div key={src} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  {label[src]}: <span style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-mono)' }}>{formatINR(amt)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
