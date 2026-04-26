import type { WizardFormData, ITRForm, WizardStep } from '@/types'

// ─── Wizard Steps Config ──────────────────────────────────────────────────────

export const WIZARD_STEPS: WizardStep[] = [
  { id: 'personal',   title: 'Personal Details',   subtitle: 'Tell us about yourself',           icon: '👤' },
  { id: 'income',     title: 'Income Sources',      subtitle: 'Where does your money come from?', icon: '💰' },
  { id: 'special',    title: 'Special Scenarios',   subtitle: 'Assets, directorship & more',      icon: '🔍' },
  { id: 'deductions', title: 'Deductions & Taxes',  subtitle: 'Reduce your tax burden',           icon: '📊' },
  { id: 'review',     title: 'Review & Analyse',    subtitle: 'Let AI pick your ITR form',        icon: '🤖' },
]

// ─── Financial Years ──────────────────────────────────────────────────────────

export const FINANCIAL_YEARS = [
  { value: '2025-26', label: 'FY 2025-26 (AY 2026-27) — Current' },  // ← NEW (Apr 1 2025 – Mar 31 2026)
  { value: '2024-25', label: 'FY 2024-25 (AY 2025-26)' },
  { value: '2023-24', label: 'FY 2023-24 (AY 2024-25)' },
]

// ─── ITR Form Reference Data ──────────────────────────────────────────────────

export const ITR_FORMS: Record<ITRForm, {
  name: string
  fullName: string
  description: string
  eligibility: string[]
  notFor: string[]
  color: string
}> = {
  'ITR-1': {
    name: 'Sahaj',
    fullName: 'ITR-1 (Sahaj)',
    description: 'Simplest form for salaried individuals',
    eligibility: [
      'Resident individual (not NRI/RNOR)',
      'Total income up to ₹50 lakh',
      'Income from salary/pension',
      'Income from one house property',
      'Income from other sources (interest, dividends)',
      'Agricultural income up to ₹5,000',
    ],
    notFor: [
      'Income above ₹50 lakh',
      'Capital gains',
      'Business/profession income',
      'Foreign assets or income',
      'Director in a company',
      'Unlisted equity shares holder',
      'NRI or RNOR',
    ],
    color: '#20b877',
  },
  'ITR-2': {
    name: 'ITR-2',
    fullName: 'ITR-2',
    description: 'For individuals with capital gains or foreign assets',
    eligibility: [
      'Individual or HUF',
      'Income from salary/pension',
      'Income from house property',
      'Capital gains (short/long term)',
      'Foreign income or assets',
      'Director in a company',
      'Unlisted equity shares',
      'Agricultural income above ₹5,000',
    ],
    notFor: [
      'Business or profession income (use ITR-3)',
      'Companies, LLPs, Firms',
    ],
    color: '#3b82f6',
  },
  'ITR-3': {
    name: 'ITR-3',
    fullName: 'ITR-3',
    description: 'For individuals with business or professional income',
    eligibility: [
      'Individual or HUF',
      'Proprietary business income',
      'Professional income (doctor, lawyer, CA, etc.)',
      'Partner in a firm',
      'All types of income allowed',
    ],
    notFor: [
      'Companies, LLPs, Firms (use ITR-5)',
      'Persons eligible for ITR-4 (presumptive) who opt for it',
    ],
    color: '#8b5cf6',
  },
  'ITR-4': {
    name: 'Sugam',
    fullName: 'ITR-4 (Sugam)',
    description: 'For presumptive business income (Section 44AD/44ADA/44AE)',
    eligibility: [
      'Resident individual, HUF, or Firm (not LLP)',
      'Presumptive business income under Sec 44AD',
      'Presumptive professional income under Sec 44ADA',
      'Transport business under Sec 44AE',
      'Total income up to ₹50 lakh',
    ],
    notFor: [
      'Income above ₹50 lakh',
      'Capital gains',
      'Foreign assets/income',
      'Director in company',
      'Unlisted equity shares',
      'LLPs (use ITR-5)',
    ],
    color: '#f59e0b',
  },
  'ITR-5': {
    name: 'ITR-5',
    fullName: 'ITR-5',
    description: 'For firms, LLPs, AOPs, BOIs and other entities',
    eligibility: [
      'Partnership firms',
      'LLPs (Limited Liability Partnerships)',
      'Association of Persons (AOP)',
      'Body of Individuals (BOI)',
      'Artificial Juridical Persons',
      'Cooperative societies',
      'Local authorities',
    ],
    notFor: [
      'Individuals or HUFs (use ITR-1/2/3/4)',
      'Companies (use ITR-6)',
      'Trusts/institutions filing ITR-7',
    ],
    color: '#ec4899',
  },
  'ITR-6': {
    name: 'ITR-6',
    fullName: 'ITR-6',
    description: 'For companies other than those claiming Sec 11 exemption',
    eligibility: [
      'All companies registered under Companies Act',
      'Foreign companies operating in India',
      'Domestic companies',
    ],
    notFor: [
      'Companies claiming exemption under Section 11 (use ITR-7)',
      'Individuals, HUFs, or firms',
    ],
    color: '#ef4444',
  },
  'ITR-7': {
    name: 'ITR-7',
    fullName: 'ITR-7',
    description: 'For trusts, institutions and political parties',
    eligibility: [
      'Trusts claiming exemption under Sec 139(4A)',
      'Political parties under Sec 139(4B)',
      'Scientific/research institutions under Sec 139(4C)',
      'Universities and colleges under Sec 139(4D)',
      'Business trusts under Sec 139(4E)',
      'Investment funds under Sec 139(4F)',
    ],
    notFor: [
      'Commercial companies (use ITR-6)',
      'Regular individuals or firms',
    ],
    color: '#64748b',
  },
}

// ─── Pre-screening Rule Engine (before AI) ────────────────────────────────────

export function preScreenITRForm(data: WizardFormData): {
  form: ITRForm | null
  confidence: 'high' | 'medium' | 'low'
  reason: string
} {
  const { entityType, residencyStatus, incomeSources, totalIncome } = data

  // Companies
  if (entityType === 'company') {
    if (data.isTrustOrInstitution) return { form: 'ITR-7', confidence: 'high', reason: 'Company claiming Sec 11 exemption' }
    return { form: 'ITR-6', confidence: 'high', reason: 'All companies must file ITR-6' }
  }

  // Trusts
  if (data.isTrustOrInstitution && entityType !== 'company') {
    return { form: 'ITR-7', confidence: 'high', reason: 'Trusts and institutions file ITR-7' }
  }

  // Firms/LLPs/AOPs
  if (['firm', 'aop_boi'].includes(entityType as string)) {
    if (data.isLLP) return { form: 'ITR-5', confidence: 'high', reason: 'LLPs file ITR-5' }
    return { form: 'ITR-5', confidence: 'high', reason: 'Firms, AOPs and BOIs file ITR-5' }
  }

  // Individual / HUF checks
  const income = Number(totalIncome) || 0

  // ITR-1 check (most restrictive)
  if (
    entityType === 'individual' &&
    residencyStatus === 'resident' &&
    income <= 5000000 &&
    !data.hasForeignAssets &&
    !data.hasForeignIncome &&
    !data.isDirectorInCompany &&
    !data.hasUnlistedShares &&
    !data.isPartnerInFirm &&
    !incomeSources.includes('capital_gains') &&
    !incomeSources.includes('business_profession') &&
    !incomeSources.includes('foreign_income') &&
    (Number(data.agriculturalIncome) || 0) <= 5000
  ) {
    return { form: 'ITR-1', confidence: 'high', reason: 'Simple salaried resident individual under ₹50L' }
  }

  // ITR-4 (Presumptive)
  if (
    ['individual', 'huf', 'firm'].includes(entityType as string) &&
    residencyStatus === 'resident' &&
    income <= 5000000 &&
    incomeSources.includes('business_profession') &&
    !data.hasForeignAssets &&
    !data.hasForeignIncome &&
    !data.isDirectorInCompany &&
    !data.hasUnlistedShares &&
    !incomeSources.includes('capital_gains')
  ) {
    return { form: 'ITR-4', confidence: 'medium', reason: 'May be eligible for presumptive taxation — AI will confirm' }
  }

  // ITR-3 for individuals/HUF with business
  if (
    ['individual', 'huf'].includes(entityType as string) &&
    (incomeSources.includes('business_profession') || data.isPartnerInFirm)
  ) {
    return { form: 'ITR-3', confidence: 'medium', reason: 'Business/profession income for individual/HUF' }
  }

  // ITR-2 for individuals with capital gains or foreign
  if (
    ['individual', 'huf'].includes(entityType as string) &&
    (incomeSources.includes('capital_gains') ||
      data.hasForeignAssets ||
      data.hasForeignIncome ||
      data.isDirectorInCompany ||
      data.hasUnlistedShares ||
      residencyStatus !== 'resident' ||
      income > 5000000)
  ) {
    return { form: 'ITR-2', confidence: 'medium', reason: 'Complex income profile — AI will verify' }
  }

  return { form: null, confidence: 'low', reason: 'Complex profile — AI analysis needed' }
}

// ─── Tax Calculation Helpers ──────────────────────────────────────────────────

/**
 * OLD REGIME — FY 2025-26 (AY 2026-27)
 * Slabs unchanged from prior years; age-based exemption limits apply.
 *   < 60 yrs  : basic exemption ₹2.5L
 *   60–79 yrs : basic exemption ₹3L   (senior citizen)
 *   80+ yrs   : basic exemption ₹5L   (super senior citizen)
 * Rebate u/s 87A: up to ₹12,500 if taxable income ≤ ₹5L
 */
export function calculateTaxOldRegime(taxableIncome: number, age: number): number {
  let tax = 0

  if (age >= 80) {
    // Super senior citizen — exemption up to ₹5L
    if (taxableIncome <= 500000) tax = 0
    else if (taxableIncome <= 1000000) tax = (taxableIncome - 500000) * 0.20
    else tax = 100000 + (taxableIncome - 1000000) * 0.30
  } else if (age >= 60) {
    // Senior citizen — exemption up to ₹3L
    if (taxableIncome <= 300000) tax = 0
    else if (taxableIncome <= 500000) tax = (taxableIncome - 300000) * 0.05
    else if (taxableIncome <= 1000000) tax = 10000 + (taxableIncome - 500000) * 0.20
    else tax = 110000 + (taxableIncome - 1000000) * 0.30
  } else {
    // Below 60 — exemption up to ₹2.5L
    if (taxableIncome <= 250000) tax = 0
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.20
    else tax = 112500 + (taxableIncome - 1000000) * 0.30
  }

  // Rebate u/s 87A — old regime: up to ₹12,500 if income ≤ ₹5L
  if (taxableIncome <= 500000 && tax > 0) tax = Math.max(0, tax - 12500)

  return tax
}

/**
 * NEW REGIME — FY 2025-26 (AY 2026-27)  [Budget 2025 revised slabs]
 * Same slabs for ALL age groups (no age-based exemption in new regime).
 *
 * Slab rates:
 *   ₹0      – ₹4,00,000  →  0%
 *   ₹4L     – ₹8,00,000  →  5%
 *   ₹8L     – ₹12,00,000 → 10%
 *   ₹12L    – ₹16,00,000 → 15%
 *   ₹16L    – ₹20,00,000 → 20%
 *   ₹20L    – ₹24,00,000 → 25%
 *   Above ₹24,00,000     → 30%
 *
 * Rebate u/s 87A: up to ₹60,000 if taxable income ≤ ₹12L
 * (effectively zero tax up to ₹12L; salaried get additional ₹75K std. deduction)
 */
export function calculateTaxNewRegime(taxableIncome: number): number {
  let tax = 0

  if (taxableIncome <= 400000) {
    tax = 0
  } else if (taxableIncome <= 800000) {
    tax = (taxableIncome - 400000) * 0.05
  } else if (taxableIncome <= 1200000) {
    tax = 20000 + (taxableIncome - 800000) * 0.10
  } else if (taxableIncome <= 1600000) {
    tax = 60000 + (taxableIncome - 1200000) * 0.15
  } else if (taxableIncome <= 2000000) {
    tax = 120000 + (taxableIncome - 1600000) * 0.20
  } else if (taxableIncome <= 2400000) {
    tax = 200000 + (taxableIncome - 2000000) * 0.25
  } else {
    tax = 300000 + (taxableIncome - 2400000) * 0.30
  }

  // Rebate u/s 87A — new regime: up to ₹60,000 if income ≤ ₹12L
  if (taxableIncome <= 1200000 && tax > 0) tax = Math.max(0, tax - 60000)

  return tax
}

/**
 * Surcharge — FY 2025-26 (AY 2026-27)
 * Old regime  : 10% / 15% / 25% / 37% at ₹50L / ₹1Cr / ₹2Cr / ₹5Cr
 * New regime  : capped at 25% (no 37% slab)
 *
 * Pass isNewRegime=true to cap surcharge at 25%.
 */
export function calculateSurcharge(income: number, tax: number, isNewRegime = false): number {
  if (income <= 5000000) return 0
  if (income <= 10000000) return tax * 0.10
  if (income <= 20000000) return tax * 0.15
  // New regime: max surcharge 25%; old regime: 25% up to ₹5Cr, then 37%
  if (income <= 50000000) return tax * 0.25
  return isNewRegime ? tax * 0.25 : tax * 0.37
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

// ─── Default Form State ───────────────────────────────────────────────────────

export const DEFAULT_FORM_DATA: WizardFormData = {
  entityType: '',
  residencyStatus: '',
  age: '',
  pan: '',
  financialYear: '2025-26',   // ← updated default to current FY
  isFirstTime: false,
  incomeSources: [],
  salaryIncome: '',
  housePropertyIncome: '',
  businessIncome: '',
  capitalGainsShortTerm: '',
  capitalGainsLongTerm: '',
  otherIncome: '',
  foreignIncome: '',
  totalIncome: '',
  hasForeignAssets: false,
  hasForeignIncome: false,
  isDirectorInCompany: false,
  hasUnlistedShares: false,
  isPartnerInFirm: false,
  hasAgriculturalIncome: false,
  agriculturalIncome: '',
  isTrustOrInstitution: false,
  isCompany: false,
  isLLP: false,
  taxRegime: '',
  deduction80C: '',
  deduction80D: '',
  deductionOther: '',
  tdsPaid: '',
  advanceTaxPaid: '',
  selfAssessmentTax: '',
  aiProvider: 'claude',
}