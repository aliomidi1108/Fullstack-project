/**
 * Home Page Component
 * 
 * Main landing page matching Figma design pixel-perfectly.
 * Composed of reusable section components.
 */
import HeroSection from '../components/sections/HeroSection'
import FeatureCardsSection from '../components/sections/FeatureCardsSection'
import LearningPathSection from '../components/sections/LearningPathSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import FAQSection from '../components/sections/FAQSection'

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Main headline, description, CTA buttons, and image carousel */}
      <HeroSection />
      
      {/* Feature Cards Section - Vertical stack of feature cards */}
      <FeatureCardsSection />
      
      {/* Learning Path Section - Course cards and learning path information */}
      <LearningPathSection />
      
      {/* Testimonials Section - Student testimonials */}
      <TestimonialsSection />
      
      {/* FAQ Section - Frequently asked questions with accordion */}
      <FAQSection />
    </div>
  )
}

export default HomePage

