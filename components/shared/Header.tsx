/**
 * Header Component
 *
 * A reusable header component that displays a title and optional subtitle.
 * Used across the application to maintain consistent heading styles and layout.
 *
 * Features:
 * - Consistent typography using custom classes
 * - Optional subtitle support
 * - Responsive text styling
 * - Semantic HTML structure
 */

import React from 'react'

interface HeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Renders a page header with optional subtitle
 * @param {HeaderProps} props - Component properties
 * @returns {JSX.Element} Header component with title and optional subtitle
 */
const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <>
      {/* Main heading with bold styling */}
      <h2 className="h2-bold text-dark-600">{title}</h2>

      {/* Conditional rendering of subtitle with consistent spacing */}
      {subtitle && <p className="p-16-regular mt-4">{subtitle}</p>}
    </>
  )
}

export default Header