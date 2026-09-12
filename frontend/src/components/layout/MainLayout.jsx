import Header from './Header'
import Footer from './Footer'
import ChatbotWidget from '../ChatbotWidget'

/**
 * MainLayout Component
 * 
 * Global layout wrapper for all pages.
 * Provides consistent structure with Header, main content area, and Footer.
 * 
 * TODO: When implementing UI design:
 * - Add any global layout features (sidebars, modals, notifications)
 * - Update spacing and styling to match design specifications
 * - Add any required layout-specific state management
 * 
 * @param {React.ReactNode} children - Page content to render
 */
function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TODO: Add any global overlays, modals, or notifications here */}
      
      <Header />
      
      <main className="flex-grow pt-24 lg:pt-28">
        {/* TODO: Add page transition animations if needed */}
        {children}
      </main>
      
      <Footer />
      <ChatbotWidget />
    </div>
  )
}

export default MainLayout
