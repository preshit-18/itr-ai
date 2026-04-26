'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { WIZARD_STEPS, DEFAULT_FORM_DATA } from '@/data/itr-data'
import type { WizardFormData, ITRAnalysisResult } from '@/types'
import StepPersonal from './steps/StepPersonal'
import StepIncome from './steps/StepIncome'
import StepSpecial from './steps/StepSpecial'
import StepDeductions from './steps/StepDeductions'
import StepReview from './steps/StepReview'
import ResultsPanel from '@/components/results/ResultsPanel'

export default function WizardClient() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<WizardFormData>(DEFAULT_FORM_DATA)
  const [result, setResult] = useState<ITRAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateFormData = useCallback((updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const totalSteps = WIZARD_STEPS.length
  const progress = ((currentStep) / (totalSteps - 1)) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
    setError(null)
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, provider: formData.aiProvider }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setCurrentStep(0)
    setFormData(DEFAULT_FORM_DATA)
    setError(null)
  }

  // Show results
  if (result) {
    return (
      <ResultsPanel
        result={result}
        formData={formData}
        onReset={handleReset}
      />
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepPersonal data={formData} onChange={updateFormData} />
      case 1: return <StepIncome data={formData} onChange={updateFormData} />
      case 2: return <StepSpecial data={formData} onChange={updateFormData} />
      case 3: return <StepDeductions data={formData} onChange={updateFormData} />
      case 4: return (
        <StepReview
          data={formData}
          onChange={updateFormData}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          error={error}
        />
      )
      default: return null
    }
  }

  const step = WIZARD_STEPS[currentStep]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header style={{
        borderBottom: '1px solid var(--paper-mid)',
        padding: '0 24px',
        background: 'white',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 800, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 60,
        }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            textDecoration: 'none', color: 'var(--ink)',
          }}>
            <span style={{ fontSize: 20 }}>🇮🇳</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>ITR Advisor</span>
          </Link>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 6 }}>
            {WIZARD_STEPS.map((s, i) => (
              <button
                type="button"
                key={s.id}
                onClick={() => i < currentStep && setCurrentStep(i)}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: 'none',
                  background: i === currentStep
                    ? 'var(--saffron)'
                    : i < currentStep
                    ? 'var(--jade)'
                    : 'var(--paper-mid)',
                  color: i <= currentStep ? 'white' : 'var(--ink-soft)',
                  fontSize: 11, fontWeight: 700,
                  cursor: i < currentStep ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title={s.title}
              >
                {i < currentStep ? '✓' : i + 1}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
        {/* Progress bar */}
        <div className="progress-bar" style={{ margin: '0 0 0', borderRadius: 0 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 24px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
        {/* Step Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'var(--saffron-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
              border: '1.5px solid rgba(255,124,10,0.2)',
            }}>
              {step.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {currentStep + 1} of {totalSteps}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>
                {step.title}
              </h1>
            </div>
          </div>
          <p style={{ color: 'var(--ink-mid)', fontSize: 15, marginLeft: 60 }}>{step.subtitle}</p>
        </div>

        {/* Step Content */}
        <div>
          {renderStep()}
        </div>
      </main>

      {/* Bottom Navigation */}
      {currentStep < totalSteps - 1 && (
        <div style={{
          borderTop: '1px solid var(--paper-mid)',
          padding: '16px 24px',
          background: 'white',
          position: 'sticky', bottom: 0,
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
              disabled={currentStep === 0}
              style={{ opacity: currentStep === 0 ? 0.3 : 1 }}
            >
              ← Back
            </button>

            <div style={{ display: 'flex', gap: 4 }}>
              {WIZARD_STEPS.map((_, i) => (
                <div key={i} style={{
                  width: i === currentStep ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === currentStep ? 'var(--saffron)' : i < currentStep ? 'var(--jade)' : 'var(--paper-mid)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>

            <button type="button" onClick={handleNext} className="btn-primary">
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}