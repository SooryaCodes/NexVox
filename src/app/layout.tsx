import './globals.css'
import type { Metadata } from 'next'
import AnimationProvider from '@/components/AnimationProvider'
import SmoothScroll from '@/components/ScrollTriggerSetup'
import { Inter, Orbitron } from 'next/font/google'
import SoundProvider from '@/components/SoundProvider'

// Initialize the fonts
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter'
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  title: 'NexVox - Next Generation Voice Communication Platform',
  description: 'Connect globally with live voice rooms, spatial audio, and immersive communication.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="bg-black min-h-screen">
        <SoundProvider>
          <SmoothScroll />
          
          <div>
            <AnimationProvider>
              {children}
            </AnimationProvider>
          </div>
        </SoundProvider>
      </body>
    </html>
  )
}