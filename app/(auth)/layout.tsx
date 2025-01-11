/**
 * Authentication Layout Component
 *
 * This layout component is specifically for the authentication route group ((auth)).
 * It wraps all authentication-related pages (like login, signup) with a consistent layout
 * by applying the "auth" className to the main container.
 *
 * @param {React.ReactNode} children - Child components to be rendered within the layout
 */

import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth">
      {children}
    </main>
  )
}

export default Layout