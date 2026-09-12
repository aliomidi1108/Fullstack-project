import { Link } from 'react-router-dom'

/**
 * 404 Not Found Page Component
 * 
 * Placeholder 404 error page.
 * 
 * TODO: When implementing UI design:
 * - Replace with actual 404 page design
 * - Add illustration/image from src/assets/images/
 * - Update styling to match design specifications
 * - Add helpful navigation links
 */
function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* TODO: Add 404 illustration/image */}
        <h1 className="text-6xl font-heading font-bold mb-4">
          404
        </h1>
        <h2 className="text-3xl font-semibold mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* TODO: Update button styling to match design */}
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
