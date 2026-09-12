/**
 * LoadingSpinner Component
 * 
 * Reusable loading indicator component.
 * 
 * TODO: When implementing UI design:
 * - Replace with actual loading spinner design
 * - Add size variants if needed
 * - Match colors to design system
 * 
 * @param {string} size - Spinner size (sm, md, lg)
 * @param {string} className - Additional CSS classes
 */
function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* TODO: Replace with actual spinner design from UI */}
      <div
        className={`${sizes[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default LoadingSpinner
