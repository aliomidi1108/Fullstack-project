/**
 * Feature Cards Section Component
 * 
 * Vertical stack of feature cards showcasing key features.
 * Matches Figma design pixel-perfectly.
 */
import Card from '../ui/Card'
import featureImage from '../../assets/images/image 13.png'
import featureIcon1 from '../../assets/images/Rectangle 8.png'
import featureIcon2 from '../../assets/images/Rectangle 10.png'
import featureIcon3 from '../../assets/images/Rectangle 12.png'
import featureIcon4 from '../../assets/images/Rectangle 13.png'

function FeatureCardsSection() {
  const features = [
    {
      title: 'امکان استخدام',
      description: 'امکان استخدام در بازارکار و همکاری با تیم تخصصی مانی وی',
      icon: featureIcon1,
    },
    {
      title: 'مشاوره تخصصی رایگان',
      description: 'مجهز به تیم استعدادیابی جهت پیدا کردن مسیر شغلی شما',
      icon: featureIcon2,
    },
    {
      title: 'آموزش پروژه محور',
      description: 'مناسب برای بازارکار واقعی با آموزش پروژه محور نه تنها آموزش تئوری',
      icon: featureIcon3,
    },
    {
      title: 'تمرکز بر روی مهارتها',
      description: 'تمرکز بر روی مهارتهای انسانی به همراه مهارت های مقاوم در برابر AI',
      icon: featureIcon4,
    },
  ]

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Column 1 (Right in RTL) - Feature Image - pulled to right edge */}
          <div className="flex justify-center lg:justify-end items-center lg:translate-x-24 xl:translate-x-32 2xl:translate-x-48">
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-4 w-full max-w-[30rem]">
              <img 
                src={featureImage} 
                alt="پکیج نابود نشو" 
                className="w-full h-auto rounded-3xl object-cover"
              />
            </div>
          </div>
          
          {/* Column 2 (Left in RTL) - Content and Feature Cards */}
          <div className="space-y-6 text-right">
            <div className="space-y-4">
              <h2 className="text-section-title font-semibold text-text-primary">نابود نشو!</h2>
              <p className="text-body-lg font-normal text-text-secondary leading-relaxed">
                پکیج نابود نشو مخصوص افرادی است که نمی‌خواهند قربانی آینده شغلی نامعلوم شوند. ما در این پکیج آموزشی مهارت‌هایی را آموزش می‌دهیم که قابل جایگزینی با هوش مصنوعی نیستند. افرادی که به بازارکار فعال و به نیروی انسانی نیاز دارند، قابل انجام به صورت دورکاری یا حضوری هستند و بعد از یادگیری مستقیما منجر به استخدام و درآمد می‌شوند.{' '}
                <span className="text-primary font-semibold">این فقط یک دوره آموزشی نیست؛ یک مسیر شغلی امن در عصر هوش مصنوعی است.</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="p-6 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="text-right space-y-3">
                    <img src={feature.icon} alt="" className="w-14 h-14 rounded-xl" />
                    <h3 className="text-card-title font-semibold text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-body-lg font-normal text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureCardsSection
