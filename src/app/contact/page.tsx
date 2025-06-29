import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import BackToTop from '@/components/BackToTop'

export const metadata: Metadata = {
  title: 'Contacto | Code Solutions Studio',
  description: 'Contáctanos para iniciar tu proyecto. Desarrollo web, apps móviles, e-commerce y más. Respuesta en 24 horas.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <ContactForm />
      <BackToTop />
    </main>
  )
}
