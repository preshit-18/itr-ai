import type { Metadata } from 'next'
import WizardClient from '@/components/wizard/WizardClient'

export const metadata: Metadata = {
  title: 'ITR Form Wizard — ITR Advisor India',
  description: 'Step-by-step wizard to find your correct ITR form with AI assistance',
}

export default function WizardPage() {
  return <WizardClient />
}
