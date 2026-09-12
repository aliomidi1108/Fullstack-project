/**
 * About Page Component
 * 
 * Placeholder about page.
 * 
 * TODO: When implementing UI design:
 * - Replace with actual about page content
 * - Add images from src/assets/images/
 * - Update styling to match design specifications
 * - Add sections (team, mission, values, etc.) as needed
 */
function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-6">
          About Us
        </h1>
        
        <div className="prose prose-lg max-w-none">
          {/* TODO: Replace with actual about page content */}
          <p className="text-lg text-gray-600 mb-6">
            This is a placeholder about page. Replace this content with your actual about page information.
          </p>
          
          {/* TODO: Add images, sections, and content as per design */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              Add your mission statement here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
