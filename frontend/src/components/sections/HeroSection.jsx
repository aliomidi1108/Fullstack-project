/**
 * Hero Section Component
 * 
 * Main hero section with headline, description, CTA buttons, and hero image.
 */
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import heroImage from '../../assets/images/image 12.png'
import arrowLeftIcon from '../../assets/icons/arrow-left-2.png'
import student1 from '../../assets/images/image 15 (1).png'
import student2 from '../../assets/images/image 15 (2).png'
import student3 from '../../assets/images/image 15 (3).png'
import student4 from '../../assets/images/image 15.png'

function HeroSection() {
  const students = [student1, student2, student3, student4]

  return (
    <section className="bg-white pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right Column - Text and Buttons (RTL) */}
          <div className="text-right space-y-8">
            {/* Main Headline - 32px Bold per typography guide */}
            <h1 className="text-h1 font-bold text-text-primary leading-tight">
              آموزش مهارت هایی که در عصر هوش مصنوعی نابود نمی شوند.
            </h1>
            
            {/* Description Paragraph - 18px Regular per typography guide */}
            <p className="text-body-lg font-normal text-text-secondary leading-relaxed">
              یک پکیج نابود نشو مخصوص افرادی است که نمی‌خواهند قربانی آینده شغلی نامعلوم شوند. ما در این پکیج آموزشی مهارت‌هایی را آموزش می‌دهیم که قابل جایگزینی با هوش مصنوعی نیستند. افرادی که به بازارکار فعال و به نیروی انسانی نیاز دارند، قابل انجام به صورت دورکاری با حضوری هستند و بعد از یادگیری مستقیما منجر به استخدام و درآمد می‌شوند. این فقط یک دوره آموزشی نیست؛ یک مسیر شغلی امن در عصر هوش مصنوعی است.
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/courses">
                <Button 
                  variant="primary"
                  icon={<img src={arrowLeftIcon} alt="" className="w-5 h-5" />}
                >
                  دوره های آموزشی
                </Button>
              </Link>
              <Button variant="outline">
                شروع مسیر شغلی
              </Button>
            </div>

            {/* Student Avatars */}
            <div className="flex items-center gap-5">
              <div className="flex -space-x-3">
                {students.map((student) => (
                  <img
                    key={student}
                    src={student}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div className="text-right">
                <p className="text-body-md font-normal text-text-primary">
                  تعداد دانشجوهای فعال <span className="text-primary font-semibold">+۱۰۰۰</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Left Column - Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <img 
                src={heroImage} 
                alt="آکادمی مانی وی" 
                className="w-full h-auto object-cover"
              />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
