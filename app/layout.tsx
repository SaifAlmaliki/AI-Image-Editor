/**
 * Root Layout Component
 *
 * This is the main layout component that wraps the entire application.
 * It provides:
 * - Authentication via Clerk
 * - Global font configuration (IBM Plex Sans)
 * - Basic HTML structure with language and metadata
 * - Global CSS styles
 */

import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

// Configure IBM Plex Sans font with specific weights and subset
const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex'  // CSS variable for use in styles
});

// Define application metadata for SEO and browser tab
export const metadata: Metadata = {
  title: "Imaginify",
  description: "AI-powered image generator",
};

// Root layout component that wraps all pages
export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;  // Child components to be rendered within the layout
}>) {
  return (
    // Configure Clerk authentication provider with custom primary color
    <ClerkProvider appearance={{
      variables: { colorPrimary: '#624cf5' }
    }}>
      <html lang="en">
        {/* Apply IBM Plex font and anti-aliasing to the entire application */}
        <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
