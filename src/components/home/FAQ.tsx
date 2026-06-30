import { useState } from 'react'

const FAQS = [
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day return policy on all items. Products must be in original condition with tags attached.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 5-7 business days. Express shipping is available and takes 2-3 business days.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship to over 50 countries worldwide. International shipping times vary by location.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay.',
  },
  {
    q: 'How can I track my order?',
    a: "Once your order ships, you'll receive a tracking number via email. You can use this to track your package.",
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be modified or cancelled within 24 hours of placement. Please contact our support team immediately.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
      {FAQS.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold sm:text-lg">{item.q}</span>
              <span
                className={`text-2xl leading-none transition-transform duration-300 ${
                  isOpen ? 'rotate-45' : ''
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <p className="overflow-hidden text-sm leading-relaxed text-ink-soft">
                {item.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
