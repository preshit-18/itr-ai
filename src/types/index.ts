// ─── ITR Form Types ───────────────────────────────────────────────────────────

export type ITRForm = 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4' | 'ITR-5' | 'ITR-6' | 'ITR-7'

export type ResidencyStatus = 'resident' | 'nri' | 'rnor'
export type IncomeSource =
  | 'salary'
  | 'house_property'
  | 'business_profession'
  | 'capital_gains'
  | 'other_sources'
  | 'foreign_income'
export type EntityType = 'individual' | 'huf' | 'firm' | 'company' | 'trust' | 'aop_boi'
export type TaxRegime = 'old' | 'new'
export type AIProvider = 'claude' | 'gemini' | 'openai'

// ─── Wizard Form Data ─────────────────────────────────────────────────────────

export interface WizardFormData {
  // Step 1: Personal Info
  entityType: EntityType | ''
  residencyStatus: ResidencyStatus | ''
  age: number | ''
  pan: string
  financialYear: string
  isFirstTime: boolean

  // Step 2: Income Sources
  incomeSources: IncomeSource[]
  salaryIncome: number | ''
  housePropertyIncome: number | ''
  businessIncome: number | ''
  capitalGainsShortTerm: number | ''
  capitalGainsLongTerm: number | ''
  otherIncome: number | ''
  foreignIncome: number | ''
  totalIncome: number | ''

  // Step 3: Special Scenarios
  hasForeignAssets: boolean
  hasForeignIncome: boolean
  isDirectorInCompany: boolean
  hasUnlistedShares: boolean
  isPartnerInFirm: boolean
  hasAgriculturalIncome: boolean
  agriculturalIncome: number | ''
  isTrustOrInstitution: boolean
  isCompany: boolean
  isLLP: boolean

  // Step 4: Deductions & Tax
  taxRegime: TaxRegime | ''
  deduction80C: number | ''
  deduction80D: number | ''
  deductionOther: number | ''
  tdsPaid: number | ''
  advanceTaxPaid: number | ''
  selfAssessmentTax: number | ''

  // Meta
  aiProvider: AIProvider
}

// ─── AI Response ──────────────────────────────────────────────────────────────

export interface ITRAnalysisResult {
  recommendedForm: ITRForm
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  eligibilitySummary: string
  keyFactors: string[]
  taxEstimate: {
    grossIncome: number
    totalDeductions: number
    taxableIncome: number
    estimatedTax: number
    surcharge: number
    cess: number
    totalTaxLiability: number
    tdsPaid: number
    netPayable: number
    isRefund: boolean
    regime: TaxRegime
  }
  filingDeadline: string
  filingSteps: FilingStep[]
  documentsRequired: string[]
  importantNotes: string[]
  alternativeForms?: { form: ITRForm; reason: string }[]
}

export interface FilingStep {
  step: number
  title: string
  description: string
  link?: string
}

// ─── Question Config ──────────────────────────────────────────────────────────

export interface WizardStep {
  id: string
  title: string
  subtitle: string
  icon: string
}

export type QuestionType = 'radio' | 'checkbox' | 'number' | 'text' | 'toggle' | 'select'

export interface Question {
  id: keyof WizardFormData
  label: string
  type: QuestionType
  options?: { value: string; label: string; description?: string }[]
  placeholder?: string
  helpText?: string
  showIf?: (data: WizardFormData) => boolean
  required?: boolean
  min?: number
  max?: number
}
