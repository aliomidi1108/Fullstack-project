/**
 * Testimonials Section Component
 * 
 * Section displaying student testimonials in a horizontal carousel.
 * Matches Figma design pixel-perfectly.
 */
import Card from '../ui/Card'
import user1 from '../../assets/images/User1.png'
import user2 from '../../assets/images/User2.png'
import user3 from '../../assets/images/User3.png'

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'صبا صادقی',
      course: 'دانشجوی پکیج نابود نشو!',
      text: 'به جرئت میتونم بگم ثبت نام توی این دوره بهترین تصمیمی بود که توی این چند سال اخیر گرفتم...',
      avatar: user1
    },
    {
      name: 'علی احمدی',
      course: 'دانشجوی پکیج نابود نشو!',
      text: 'دوره بسیار جامع و کاربردی بود. با این آموزش‌ها توانستم به راحتی وارد بازار کار شوم.',
      avatar: user2
    },
    {
      name: 'مریم رضایی',
      course: 'دانشجوی پکیج نابود نشو!',
      text: 'پشتیبانی عالی و محتوای با کیفیت. به همه توصیه می‌کنم این دوره را بگذرانند.',
      avatar: user3
    }
  ]

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Section Titles */}
        <div className="text-center space-y-2 mb-12">
          {/* Section Title - 24px SemiBold per typography guide */}
          <h2 className="text-section-title font-semibold text-text-primary">با کمال افتخار</h2>
          {/* Description - 18px Regular per typography guide */}
          <p className="text-body-lg font-normal text-text-secondary">
            دانشجوهای آکادمی رضایت خود را از دوره مذکور ثبت کرده اند
          </p>
        </div>
        
        {/* Testimonial Cards - horizontal scroll on mobile */}
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 overflow-x-scroll pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible max-w-6xl md:mx-auto scroll-x-touch [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="flex-shrink-0 w-[85vw] min-w-[280px] md:w-auto md:min-w-0 p-6 rounded-2xl border-r-4 border-primary text-right shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
              >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="space-y-1">
                    {/* Name - 18px SemiBold per typography guide */}
                    <h4 className="text-body-lg font-semibold text-text-primary">
                      {testimonial.name}
                    </h4>
                    {/* Secondary text - 16px Regular per typography guide */}
                    <p className="text-body-md font-normal text-text-secondary">
                      {testimonial.course}
                    </p>
                  </div>
                </div>
                
                {/* Testimonial text - 18px Regular per typography guide */}
                <p className="text-body-lg font-normal text-text-primary line-clamp-4">
                  {testimonial.text}
                </p>
              </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
