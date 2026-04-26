'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ITR_FORMS } from '@/data/itr-data'
import type { ITRForm } from '@/types'

const ITR_FORM_KEYS = Object.keys(ITR_FORMS) as ITRForm[]

export default function HomePage() {
  const [hoveredForm, setHoveredForm] = useState<ITRForm | null>(null)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{
        borderBottom: '1px solid var(--paper-mid)',
        padding: '0 24px',
        background: 'rgba(250,248,244,0.95)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--saffron)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>🇮🇳</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>
              ITR Advisor
            </span>
          </div>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#forms" style={{ color: 'var(--ink-mid)', textDecoration: 'none', fontSize: 14, padding: '8px 16px' }}>
              ITR Forms
            </a>
            <a href="#how-it-works" style={{ color: 'var(--ink-mid)', textDecoration: 'none', fontSize: 14, padding: '8px 16px' }}>
              How It Works
            </a>
            <Link href="/wizard" style={{
              background: 'var(--saffron)', color: 'white', textDecoration: 'none',
              padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              boxShadow: '0 2px 8px rgba(255,124,10,0.3)',
            }}>
              Start Free →
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: 40, right: '10%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(255,124,10,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 100, left: '5%',
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(32,184,119,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--saffron-light)', color: 'var(--saffron-dark)',
            borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 500,
            border: '1px solid rgba(255,124,10,0.2)',
            marginBottom: 24,
          }}>
            <span>✨</span>
            <span>AI-Powered • FY 2025-26 Updated • Free to Use</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: 24,
          }}>
            Find Your Correct
            <br />
            <span className="gradient-text">ITR Form</span> in Minutes
          </h1>

          <p style={{
            fontSize: 18,
            color: 'var(--ink-mid)',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 560,
            margin: '0 auto 40px',
          }}>
            Answer a few simple questions. Our AI expert analyses your income profile and
            recommends the right ITR form (ITR-1 to ITR-7) with a complete tax estimate and
            step-by-step filing guide.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/wizard" className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
              🤖 Start AI Analysis — Free
            </Link>
            <a href="#how-it-works" className="btn-secondary" style={{ fontSize: 16 }}>
              How it works
            </a>
          </div>

          {/* Trust signals */}
          <div style={{ marginTop: 48, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'No data stored' },
              { icon: '⚡', text: 'Results in ~30 sec' },
              { icon: '✅', text: 'FY 2024-25 rules' },
              { icon: '🤖', text: 'Claude / Gemini / GPT' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)', fontSize: 14 }}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ITR Forms Overview ─────────────────────────────────────────── */}
      <section id="forms" style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
              Which ITR Form is Right for You?
            </h2>
            <p style={{ color: 'var(--ink-mid)', fontSize: 16 }}>
              India has 7 ITR forms. Each applies to different taxpayer profiles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {ITR_FORM_KEYS.map((key) => {
              const form = ITR_FORMS[key]
              const isHovered = hoveredForm === key
              return (
                <div
                  key={key}
                  className="card"
                  style={{
                    padding: 20,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovered ? `0 12px 32px rgba(0,0,0,0.12)` : undefined,
                    borderLeft: `4px solid ${form.color}`,
                  }}
                  onMouseEnter={() => setHoveredForm(key)}
                  onMouseLeave={() => setHoveredForm(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: `${form.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontSize: 12, fontWeight: 700,
                      color: form.color,
                      letterSpacing: '0.5px',
                      border: `1.5px solid ${form.color}30`,
                      flexShrink: 0,
                    }}>
                      {key.replace('ITR-', '')}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                        {form.fullName}
                      </div>
                      {form.name !== key && (
                        <div style={{ fontSize: 12, color: form.color, fontWeight: 500 }}>{form.name}</div>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{form.description}</p>
                  <div style={{ marginTop: 12 }}>
                    {form.eligibility.slice(0, 2).map((e) => (
                      <div key={e} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: form.color, fontSize: 12, marginTop: 2 }}>✓</span>
                        <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{e}</span>
                      </div>
                    ))}
                    {form.eligibility.length > 2 && (
                      <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                        +{form.eligibility.length - 2} more criteria
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/wizard" className="btn-primary">
              🤖 Let AI Pick My Form Automatically
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--ink-mid)', fontSize: 16 }}>Simple, fast, and accurate</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { step: '01', icon: '📝', title: 'Answer Questions', desc: 'Tell us about your income, assets, and residency in a guided 4-step wizard' },
              { step: '02', icon: '🤖', title: 'AI Analysis', desc: 'Claude, Gemini, or GPT-4o analyses your profile against all ITR form criteria' },
              { step: '03', icon: '📊', title: 'Get Your Form', desc: 'Receive your recommended ITR form with a detailed explanation and tax estimate' },
              { step: '04', icon: '📋', title: 'File with Confidence', desc: 'Follow our step-by-step guide and document checklist to file successfully' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{
                  width: 64, height: 64,
                  borderRadius: 20,
                  background: 'var(--saffron-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, margin: '0 auto 16px',
                  border: '2px solid rgba(255,124,10,0.15)',
                }}>
                  {icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--saffron)', letterSpacing: '2px', marginBottom: 8 }}>
                  STEP {step}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Providers Banner ────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', background: 'var(--ink)', color: 'white' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16, letterSpacing: '2px' }}>
            POWERED BY WORLD-CLASS AI
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { name: 'Claude', by: 'Anthropic', emoji: '🧠' },
              { name: 'Gemini', by: 'Google', emoji: '✦' },
              { name: 'GPT-4o', by: 'OpenAI', emoji: '⚡' },
            ].map(({ name, by, emoji }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>by {by}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 20, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            You choose your preferred AI. Your data never leaves your session.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 900, marginBottom: 16 }}>
            Ready to file right?
          </h2>
          <p style={{ color: 'var(--ink-mid)', fontSize: 18, marginBottom: 32 }}>
            Join thousands of Indians who filed the correct ITR form — stress free.
          </p>
          <Link href="/wizard" className="btn-primary" style={{ fontSize: 18, padding: '18px 48px' }}>
            Start AI Analysis — It&apos;s Free →
          </Link>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--ink-soft)' }}>
            ✓ No signup required &nbsp;·&nbsp; ✓ No data stored &nbsp;·&nbsp; ✓ FY 2025-26 rules
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--paper-mid)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--ink-soft)',
        fontSize: 13,
      }}>
        <p>
          <strong style={{ color: 'var(--ink)' }}>ITR Advisor India</strong> — For informational purposes only.
          Always verify with a qualified CA or the official{' '}
          <a href="https://www.incometax.gov.in" target="_blank" rel="noopener" style={{ color: 'var(--saffron)' }}>
            Income Tax portal
          </a>.
        </p>
        <p style={{ marginTop: 8 }}>
          Built with ❤️ for Indian taxpayers · FY 2025-26 (AY 2026-27)
        </p>
      </footer>
    </main>
  )
}
