import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact QiraatHub Academy',
  description: 'Get in touch with QiraatHub Academy for inquiries about our Quranic recitation courses and programs.',
  alternates: {
    canonical: 'https://academy.qiraathub.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
