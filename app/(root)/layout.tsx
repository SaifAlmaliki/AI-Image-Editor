/**
 * Root Layout Component
 *
 * This component serves as the main layout wrapper for the root route of the application.
 * It provides the following structural elements:
 * 1. A sidebar for desktop navigation
 * 2. A mobile navigation menu for responsive design
 * 3. A main content area with proper spacing and structure
 * 4. Global toast notifications support
 *
 * The layout ensures consistent spacing and positioning across all pages
 * while maintaining responsive behavior for different screen sizes.
 */

import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import { Toaster } from '@/components/ui/toaster'

// Layout component that wraps all pages in the root route
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Main container with root class for global styling
    <main className="root">
      {/* Desktop navigation sidebar */}
      <Sidebar />

      {/* Responsive navigation for mobile devices */}
      <MobileNav />

      {/* Main content container with proper spacing */}
      <div className="root-container">
        <div className="wrapper">
          {/* Render the page-specific content */}
          {children}
        </div>
      </div>

      {/* Global toast notifications component */}
      <Toaster />
    </main>
  )
}

export default Layout