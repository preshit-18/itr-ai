import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ITR Advisor India — Find Your Correct ITR Form with AI',
  description:
    'AI-powered Income Tax Return form selector for India. Get accurate ITR form recommendations (ITR-1 to ITR-7) with tax estimates and step-by-step filing guidance for FY 2024-25.',
  keywords: 'ITR form, income tax return India, ITR-1, ITR-2, ITR-3, ITR-4, ITR filing guide, tax advisor India',
  openGraph: {
    title: 'ITR Advisor India',
    description: 'Find your correct ITR form in minutes with AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
