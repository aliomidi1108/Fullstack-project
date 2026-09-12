import Section from '../components/Section'
import Card from '../components/Card'
import TestimonialCard from '../components/TestimonialCard'
import InstructorCard from '../components/InstructorCard'
import {
  aboutHeader,
  aboutMain,
  missionGoals,
  testimonials,
  instructors,
} from '../data/aboutData'

function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* About Header */}
      <Section>
        <div className="text-right max-w-4xl">
          <h1 className="text-h1 font-bold text-text-primary mb-4">
            {aboutHeader.title}
          </h1>
          <p className="text-body-lg font-normal text-text-secondary leading-relaxed">
            {aboutHeader.description}
          </p>
        </div>
      </Section>

      {/* Main About Content */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-right space-y-4">
            <h2 className="text-section-title font-semibold text-text-primary">
              {aboutMain.introTitle}
            </h2>
            <p className="text-body-lg font-normal text-text-secondary leading-relaxed">
              {aboutMain.introText}
            </p>
            <p className="text-body-lg font-semibold text-primary">
              {aboutMain.highlight}
            </p>
            <p className="text-body-lg font-normal text-text-secondary leading-relaxed">
              {aboutMain.outroText}
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-4">
              <img
                src={aboutMain.image}
                alt="درباره مانی‌وی"
                className="w-full max-w-md rounded-3xl object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Goals */}
      <Section className="bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missionGoals.map((item) => (
            <Card
              key={item._id}
              className="p-6 text-right shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
            >
              <h3 className="text-card-title font-semibold text-text-primary mb-3">
                {item.title}
              </h3>
              <p className="text-body-lg font-normal text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <div className="text-center mb-10">
          <h2 className="text-section-title font-semibold text-text-primary">
            با کمال افتخار
          </h2>
          <p className="text-body-lg font-normal text-text-secondary mt-2">
            دانشجوهای آکادمی رضایت خود را از دوره مذکور ثبت کرده‌اند
          </p>
        </div>

        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 overflow-x-scroll pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible scroll-x-touch [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="flex-shrink-0 w-[85vw] min-w-[280px] md:w-auto md:min-w-0"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Instructors */}
      <Section className="bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-section-title font-semibold text-text-primary">
            مدرسین
          </h2>
          <p className="text-body-lg font-normal text-text-secondary mt-2">
            مدرسین با تجربه و حرفه‌ای مانی‌وی
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor._id} instructor={instructor} />
          ))}
        </div>
      </Section>
    </div>
  )
}

export default About
