import { useState } from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import {
  contactHeader,
  contactItems,
  socialLinks,
} from '../data/contactData'
import instagramIcon from '../assets/icons/instagram.png'
import telegramIcon from '../assets/icons/telegram-2.svg'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitted(false)
    try {
      // MVP: simulate submit - در فاز بعدی به API وصل می‌شود
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const iconMap = {
    instagram: instagramIcon,
    telegram: telegramIcon,
  }

  return (
    <div className="min-h-screen bg-white">
        {/* Header */}
        <Section className="pt-4 md:pt-6">
          <div className="text-right max-w-4xl">
            <h1 className="text-h1 font-bold text-text-primary mb-4">
              {contactHeader.title}
            </h1>
            <p className="text-body-lg font-normal text-text-secondary leading-relaxed">
              {contactHeader.description}
            </p>
          </div>
        </Section>

        <Section className="bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              <h2 className="text-section-title font-semibold text-text-primary mb-6">
                راه‌های ارتباطی
              </h2>
              {contactItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 text-right shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                >
                  <p className="text-body-md font-normal text-text-secondary mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-body-lg font-semibold text-primary hover:opacity-80 transition-opacity"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-body-lg font-semibold text-text-primary">
                      {item.value}
                    </p>
                  )}
                </div>
              ))}

              {/* Social Links */}
              <div className="pt-4">
                <p className="text-body-md font-normal text-text-secondary mb-3">
                  شبکه‌های اجتماعی
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((s) => (
                    <a
                      key={s._id}
                      href={s.href}
                      aria-label={s.label}
                      className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <img
                        src={iconMap[s.icon]}
                        alt=""
                        className="w-6 h-6"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <h2 className="text-section-title font-semibold text-text-primary mb-6 text-right">
                ارسال پیام
              </h2>
              {submitted ? (
                <div className="text-center py-8">
                  <p className="text-body-lg font-semibold text-success mb-2">
                    پیام شما با موفقیت ارسال شد.
                  </p>
                  <p className="text-body-md text-text-secondary">
                    در اسرع وقت با شما تماس خواهیم گرفت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-right">
                  <div>
                    <label htmlFor="name" className="block text-body-md font-normal text-text-primary mb-2">
                      نام و نام خانوادگی
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="نام خود را وارد کنید"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-body-md font-normal text-text-primary mb-2">
                      ایمیل
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-body-md font-normal text-text-primary mb-2">
                      شماره تماس
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-body-md font-normal text-text-primary mb-2">
                      پیام
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="پیام خود را بنویسید..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Section>
    </div>
  )
}

export default Contact
