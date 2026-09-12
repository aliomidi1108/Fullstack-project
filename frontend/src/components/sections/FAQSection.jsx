/**
 * FAQ Section Component
 * 
 * Frequently Asked Questions section with accordion items.
 * Matches Figma design pixel-perfectly.
 */
import { useState } from 'react'
import Card from '../ui/Card'
import arrowDownIcon from '../../assets/icons/arrow-down-2.png'

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'این دوره به چه دردی میخوره و آینده بخشش میشه؟',
      answer: 'این دوره مهارت‌هایی را آموزش می‌دهد که قابل جایگزینی با هوش مصنوعی نیستند و برای ورود به بازار کار بسیار مناسب است. آینده این مهارت‌ها تضمین شده است.'
    },
    {
      question: 'چقدر زمان برای تکمیل دوره نیاز است؟',
      answer: 'دوره شامل ۱۰۰ ساعت آموزش عملی و پروژه محور است که می‌توانید با سرعت خودتان پیش بروید.'
    },
    {
      question: 'آیا بعد از اتمام دوره گواهینامه دریافت می‌کنم؟',
      answer: 'بله، پس از تکمیل موفقیت‌آمیز دوره و انجام پروژه‌های نهایی، گواهینامه معتبر دریافت خواهید کرد.'
    },
    {
      question: 'آیا امکان پرداخت اقساطی وجود دارد؟',
      answer: 'بله، امکان پرداخت اقساطی برای این دوره فراهم است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Section Title - 24px SemiBold per typography guide */}
        <h2 className="text-section-title font-semibold text-text-primary text-center mb-12">
          سوالات متداول
        </h2>
        
        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index}
              className="border border-gray-200 overflow-hidden rounded-2xl"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Question Number Indicator */}
                  <div className={`w-2 h-full bg-primary rounded-r-lg ${openIndex === index ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  
                  {/* Question - 18px Regular per typography guide */}
                  <span className="text-body-lg font-normal text-text-primary flex-1">
                    {String(index + 1).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])}. {faq.question}
                  </span>
                </div>
                
                {/* Toggle Icon */}
                <img 
                  src={arrowDownIcon} 
                  alt="" 
                  className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              {/* Answer (Expanded) - 18px Regular per typography guide */}
              {openIndex === index && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="flex items-start gap-4 pt-4">
                    <div className="w-2 h-full bg-primary rounded-r-lg mt-1" />
                    <p className="text-body-lg font-normal text-text-primary flex-1">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
