import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cassetto | Independent Music Distribution Platform & Digital Scarcity',
  description: 'Join the Underground Nation. Cassetto is a private digital space for independent music, featuring digital scarcity, true ownership, and a direct connection to artists.',
}

export default function CassettoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
