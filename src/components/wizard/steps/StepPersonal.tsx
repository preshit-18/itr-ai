'use client'

import type { WizardFormData } from '@/types'
import { FINANCIAL_YEARS } from '@/data/itr-data'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
}

const ENTITY_TYPES = [
  { value: 'individual', label: 'Individual', desc: 'Salaried, freelancer, investor', icon: '👤' },
  { value: 'huf', label: 'HUF', desc: 'Hindu Undivided Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'firm', label: 'Firm / LLP', desc: 'Partnership or LLP', icon: '🤝' },
  { value: 'company', label: 'Company', desc: 'Pvt Ltd, Public Ltd', icon: '🏢' },
  { value: 'trust', label: 'Trust / NGO', desc: 'Charitable institution', icon: '🏛️' },
  { value: 'aop_boi', label: 'AOP / BOI', desc: 'Association or body of individuals', icon: '👥' },
]

const RESIDENCY_OPTIONS = [
  { value: 'resident', label: 'Resident Indian', desc: 'Stayed 182+ days in India this FY', icon: '🇮🇳' },
  { value: 'nri', label: 'NRI', desc: 'Non-Resident Indian', icon: '✈️' },
  { value: 'rnor', label: 'RNOR', desc: 'Resident but Not Ordinarily Resident', icon: '🌐' },
]

export default function StepPersonal({ data, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* First-time filer banner */}
      <div style={{
        background: 'linear-gradient(135deg, #fff8ed, #ffefd4)',
        border: '1px solid rgba(255,124,10,0.2)',
        borderRadius: 14, padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginBottom: 4 }}>
            🌟 First-time taxpayer?
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-mid)' }}>
            Turn this on and we'll provide extra guidance throughout
          </div>
        </div>
        <label className="toggle-switch" style={{ flexShrink: 0 }}>
          <input
            type="checkbox"
            checked={data.isFirstTime}
            onChange={(e) => onChange({ isFirstTime: e.target.checked })}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      {/* Financial Year */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 10, color: 'var(--ink)' }}>
          Financial Year
        </label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {FINANCIAL_YEARS.map((fy) => (
            <button
              key={fy.value}
              onClick={() => onChange({ financialYear: fy.value })}
              style={{
                padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                border: `2px solid ${data.financialYear === fy.value ? 'var(--saffron)' : 'var(--paper-mid)'}`,
                background: data.financialYear === fy.value ? 'var(--saffron-light)' : 'white',
                color: data.financialYear === fy.value ? 'var(--saffron-dark)' : 'var(--ink-mid)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {fy.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entity Type */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 10, color: 'var(--ink)' }}>
          Who is filing this return? <span style={{ color: 'var(--crimson)' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {ENTITY_TYPES.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ entityType: opt.value as WizardFormData['entityType'] })}
              className={`option-card ${data.entityType === opt.value ? 'selected' : ''}`}
              style={{ textAlign: 'left', width: '100%' }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* LLP toggle if firm */}
      {data.entityType === 'firm' && (
        <div style={{
          background: 'white', border: '1px solid var(--paper-mid)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Is this an LLP?</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Limited Liability Partnership requires ITR-5</div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={data.isLLP} onChange={(e) => onChange({ isLLP: e.target.checked })} />
            <span className="toggle-slider" />
          </label>
        </div>
      )}

      {/* Residency (individual/HUF only) */}
      {['individual', 'huf', ''].includes(data.entityType as string) && (
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 10, color: 'var(--ink)' }}>
            Residency Status <span style={{ color: 'var(--crimson)' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RESIDENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ residencyStatus: opt.value as WizardFormData['residencyStatus'] })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px', borderRadius: 12, textAlign: 'left', width: '100%',
                  border: `2px solid ${data.residencyStatus === opt.value ? 'var(--saffron)' : 'var(--paper-mid)'}`,
                  background: data.residencyStatus === opt.value ? 'var(--saffron-light)' : 'white',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 24 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{opt.desc}</div>
                </div>
                {data.residencyStatus === opt.value && (
                  <span style={{ marginLeft: 'auto', color: 'var(--saffron)', fontWeight: 700 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Age (individual only) */}
      {data.entityType === 'individual' && (
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 10, color: 'var(--ink)' }}>
            Your Age (as of 31st March {data.financialYear?.split('-')[1] || '2025'})
          </label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="number"
              value={data.age}
              onChange={(e) => onChange({ age: e.target.value ? parseInt(e.target.value) : '' })}
              placeholder="e.g. 32"
              min={18} max={120}
              style={{
                width: 140, height: 48,
                border: '1.5px solid var(--paper-mid)', borderRadius: 10,
                padding: '0 16px', fontSize: 16,
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              {Number(data.age) >= 80 ? '👴 Super Senior Citizen (80+) — higher basic exemption'
                : Number(data.age) >= 60 ? '🧓 Senior Citizen (60–79) — higher basic exemption'
                : data.age ? '💼 Regular taxpayer'
                : 'Age affects tax slabs and exemption limits'}
            </div>
          </div>
        </div>
      )}

      {/* PAN (optional hint) */}
      <div style={{
        background: 'var(--paper-mid)', borderRadius: 12, padding: '14px 18px',
        fontSize: 13, color: 'var(--ink-mid)',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>🔒</span>
        <p>
          We do not collect or store your PAN. Your data is only used during this session
          to generate your ITR recommendation. Nothing is saved after you close this tab.
        </p>
      </div>
    </div>
  )
}
