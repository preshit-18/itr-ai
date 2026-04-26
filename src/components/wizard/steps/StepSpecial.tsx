'use client'

import type { WizardFormData } from '@/types'

interface Props {
  data: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
}

interface ToggleCardProps {
  icon: string
  title: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
  impact?: string
  impactType?: 'warning' | 'info'
}

function ToggleCard({ icon, title, desc, checked, onChange, impact, impactType = 'info' }: ToggleCardProps) {
  return (
    <div style={{
      border: `2px solid ${checked ? 'var(--saffron)' : 'var(--paper-mid)'}`,
      borderRadius: 14,
      padding: '16px 20px',
      background: checked ? 'var(--saffron-light)' : 'white',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, flex: 1 }}>
          <span style={{ fontSize: 26, flexShrink: 0 }}>{icon}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 2 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{desc}</div>
            {impact && checked && (
              <div style={{
                marginTop: 8, fontSize: 12, fontWeight: 500,
                color: impactType === 'warning' ? '#c74700' : '#0f6e56',
                background: impactType === 'warning' ? '#fff3e0' : '#e1f5ee',
                borderRadius: 6, padding: '4px 8px', display: 'inline-block',
              }}>
                ⚠️ {impact}
              </div>
            )}
          </div>
        </div>
        <label className="toggle-switch" style={{ flexShrink: 0, marginTop: 2 }}>
          <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
          <span className="toggle-slider" />
        </label>
      </div>
    </div>
  )
}

export default function StepSpecial({ data, onChange }: Props) {
  const isIndividualOrHUF = ['individual', 'huf', ''].includes(data.entityType as string)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{
        background: 'var(--paper-mid)', borderRadius: 12, padding: '12px 16px',
        fontSize: 13, color: 'var(--ink-mid)', display: 'flex', gap: 10,
      }}>
        <span>💡</span>
        <p>These factors directly determine which ITR form applies. Answer honestly — the AI uses these to make the correct selection.</p>
      </div>

      {/* Foreign Assets / Income */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
          Foreign Connections
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ToggleCard
            icon="🏦"
            title="Foreign Bank Accounts / Assets"
            desc="Do you hold any bank accounts, property, investments, or other assets outside India?"
            checked={data.hasForeignAssets}
            onChange={(v) => onChange({ hasForeignAssets: v })}
            impact="Cannot use ITR-1 or ITR-4 — need ITR-2 or higher"
            impactType="warning"
          />
          <ToggleCard
            icon="💵"
            title="Income from Foreign Sources"
            desc="Any salary, rent, business income, or other earnings from outside India?"
            checked={data.hasForeignIncome}
            onChange={(v) => onChange({ hasForeignIncome: v })}
            impact="Requires Schedule FSI in ITR-2 or ITR-3"
            impactType="warning"
          />
        </div>
      </div>

      {/* Company / Business */}
      {isIndividualOrHUF && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
            Business Relationships
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ToggleCard
              icon="🏢"
              title="Director in a Company"
              desc="Are you currently a Director in any Indian or foreign company (including nominee director)?"
              checked={data.isDirectorInCompany}
              onChange={(v) => onChange({ isDirectorInCompany: v })}
              impact="Disqualifies from ITR-1 and ITR-4 — need ITR-2 minimum"
              impactType="warning"
            />
            <ToggleCard
              icon="📜"
              title="Holds Unlisted Equity Shares"
              desc="Do you hold shares of any company that is not listed on BSE/NSE as of 31st March?"
              checked={data.hasUnlistedShares}
              onChange={(v) => onChange({ hasUnlistedShares: v })}
              impact="Cannot use ITR-1 or ITR-4 — requires Schedule UL in ITR-2"
              impactType="warning"
            />
            <ToggleCard
              icon="🤝"
              title="Partner in a Partnership Firm"
              desc="Are you a partner in any registered or unregistered partnership firm?"
              checked={data.isPartnerInFirm}
              onChange={(v) => onChange({ isPartnerInFirm: v })}
              impact="Requires ITR-3 (not ITR-1, ITR-2, or ITR-4)"
              impactType="warning"
            />
          </div>
        </div>
      )}

      {/* Entity-specific */}
      {data.entityType === 'firm' && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
            Entity Details
          </h3>
          <ToggleCard
            icon="🏛️"
            title="Registered as LLP"
            desc="Is this firm registered as a Limited Liability Partnership under the LLP Act, 2008?"
            checked={data.isLLP}
            onChange={(v) => onChange({ isLLP: v })}
            impact="LLPs file ITR-5"
            impactType="info"
          />
        </div>
      )}

      {data.entityType === 'trust' && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-mid)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
            Trust / Institution Details
          </h3>
          <ToggleCard
            icon="🏛️"
            title="Charitable / Religious Trust"
            desc="Registered under Sec 12A/12AA/12AB claiming exemption under Sec 11 or 10(23C)?"
            checked={data.isTrustOrInstitution}
            onChange={(v) => onChange({ isTrustOrInstitution: v })}
            impact="Will file ITR-7"
            impactType="info"
          />
        </div>
      )}

      {/* Presumptive taxation hint */}
      {data.incomeSources.includes('business_profession') && isIndividualOrHUF && (
        <div style={{
          border: '1.5px solid rgba(32,184,119,0.3)',
          borderRadius: 14, padding: '16px 20px',
          background: 'rgba(32,184,119,0.04)',
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 24 }}>💡</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>
                Presumptive Taxation — Are you eligible?
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.5 }}>
                If your business turnover is under ₹3 Cr (or professional receipts under ₹75L),
                you may opt for simpler <strong>ITR-4 (Sugam)</strong> under presumptive taxation
                (Sec 44AD/44ADA). The AI will evaluate this automatically based on your income.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All clear if nothing flagged */}
      {!data.hasForeignAssets && !data.hasForeignIncome && !data.isDirectorInCompany &&
        !data.hasUnlistedShares && !data.isPartnerInFirm && (
        <div style={{
          border: '1.5px solid rgba(32,184,119,0.3)',
          borderRadius: 14, padding: '14px 18px',
          background: 'rgba(32,184,119,0.04)',
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <span style={{ fontSize: 13, color: '#0f6e56', fontWeight: 500 }}>
            No special scenarios flagged — you may qualify for a simpler ITR form.
          </span>
        </div>
      )}
    </div>
  )
}
