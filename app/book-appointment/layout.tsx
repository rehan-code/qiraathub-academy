import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Class - QiraatHub Academy',
  description: 'Schedule a class with QiraatHub Academy and receive confirmation with a calendar invite.',
  alternates: {
    canonical: 'https://academy.qiraathub.com/book-appointment',
  },
}

export default function BookAppointmentLayout({ children }: { children: React.ReactNode }) {
  return children
}
