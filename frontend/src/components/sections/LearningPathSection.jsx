/**
 * Learning Path / Courses Section Component
 * 
 * Section displaying learning path title and course cards.
 * Matches Figma design pixel-perfectly.
 */
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import courseImage1 from '../../assets/images/Rectangle 12.png'
import arrowLeftIcon from '../../assets/icons/arrow-left-2.png'
import infoIcon from '../../assets/icons/info-circle.png'
import checkIcon from '../../assets/icons/check.png'
import bookmarkIcon from '../../assets/icons/bookmark-3.png'
import placeholderIcon from '../../assets/icons/image-5.png'

function LearningPathSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Titles */}
        <div className="text-center space-y-2 mb-12">
          <p className="text-body-md font-normal text-text-secondary">مسیر یادگیری</p>
          {/* Section Title - 24px SemiBold per typography guide */}
          <h2 className="text-section-title font-semibold text-text-primary">برنامه های آموزشی</h2>
        </div>
        
        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Featured Course Card */}
          <Card className="rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <div className="p-6 space-y-6 text-right">
              <div className="flex justify-center">
                <img 
                  src={courseImage1} 
                  alt="دوره جامع نابود نشو!" 
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              </div>
              {/* Card Title - 20px SemiBold per typography guide */}
              <h3 className="text-card-title font-semibold text-text-primary">
                دوره جامع نابود نشو!
              </h3>
              {/* Description - 18px Regular per typography guide */}
              <p className="text-body-lg font-normal text-text-secondary">
                آمادگی برای بازار کار با ۱۰۰ ساعت آموزش عملی و پروژه محور
              </p>
              <Link
                to="/courses/1"
                className="inline-flex items-center gap-3 text-primary font-semibold hover:opacity-80 transition-opacity"
              >
                <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                  <img src={arrowLeftIcon} alt="" className="w-4 h-4" />
                </span>
                همین الان ثبت نام کن
              </Link>
            </div>
          </Card>
          
          {/* Future Courses Placeholder Card */}
          <Card className="rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.06)] bg-gray-100">
            <div className="p-6 space-y-4 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center">
                  <img src={placeholderIcon} alt="" className="w-8 h-8" />
                </div>
              </div>
              {/* Card Title - 20px SemiBold per typography guide */}
              <h3 className="text-card-title font-semibold text-text-primary">دوره های آینده</h3>
              {/* Secondary text - 16px Regular per typography guide */}
              <p className="text-body-md font-normal text-text-secondary">منتظر باشید...</p>
            </div>
          </Card>
        </div>
        
        {/* Small Feature Tiles */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="bg-white rounded-full px-6 py-3 border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.06)] flex items-center gap-3">
            <img src={infoIcon} alt="" className="w-5 h-5" />
            <span className="text-body-md font-semibold text-text-primary">نقشه راه تخصصی</span>
          </div>
          <div className="bg-white rounded-full px-6 py-3 border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.06)] flex items-center gap-3">
            <img src={checkIcon} alt="" className="w-5 h-5" />
            <span className="text-body-md font-semibold text-text-primary">مناسب برای ورود به بازار کار</span>
          </div>
          <div className="bg-white rounded-full px-6 py-3 border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.06)] flex items-center gap-3">
            <img src={bookmarkIcon} alt="" className="w-5 h-5" />
            <span className="text-body-md font-semibold text-text-primary">آموزش جامع و عمیق</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LearningPathSection
