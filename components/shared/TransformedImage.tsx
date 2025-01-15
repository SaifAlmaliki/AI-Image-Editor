/**
 * TransformedImage Component
 *
 * A React component that displays transformed images using Cloudinary's transformation capabilities.
 * This component handles image display, loading states, download functionality, and error handling
 * for transformed images.
 *
 * Features:
 * - Responsive image display with proper sizing
 * - Loading state indication with spinner
 * - Optional download functionality
 * - Error handling with debounced state updates
 * - Placeholder display when no image is available
 * - Cloudinary transformation support
 */

"use client"

import { dataUrl, debounce, download, getImageSize } from '@/lib/utils'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import React from 'react'

// Type definition for component props
type TransformedImageProps = {
  image: any;                                    // Image data object containing publicId, width, height
  type: string;                                  // Type of transformation being applied
  title: string;                                 // Title for the transformed image (used in download)
  transformationConfig: any;                     // Cloudinary transformation configuration
  isTransforming: boolean;                       // Loading state indicator
  setIsTransforming?: (value: boolean) => void;  // Function to update loading state
  hasDownload?: boolean;                         // Flag to show/hide download button
}

const TransformedImage = ({
  image,
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false
}: TransformedImageProps) => {
  // Handler for image download
  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // Generate Cloudinary URL with transformations and trigger download
    download(getCldImageUrl({
      width: image?.width,
      height: image?.height,
      src: image?.publicId,
      ...transformationConfig
    }), title)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header section with title and optional download button */}
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">
          Transformed
        </h3>

        {hasDownload && (
          <button className="download-btn" onClick={downloadHandler}>
            <Image
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
              className="pb-[6px]"
            />
          </button>
        )}
      </div>

      {/* Conditional rendering of transformed image or placeholder */}
      {image?.publicId && transformationConfig ? (
        <div className="relative">
          {/* Cloudinary Image component with transformation support */}
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt={image.title}
            sizes={"(max-width: 767px) 100vw, 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            className="transformed-image"
            // Reset transformation state when image loads
            onLoad={() => setIsTransforming && setIsTransforming(false)}
            // Handle errors with debounced state update
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)()
            }}
            {...transformationConfig}
          />

          {/* Loading spinner overlay */}
          {isTransforming && (
            <div className="transforming-loader">
              <Image
                src="/assets/icons/spinner.svg"
                width={50}
                height={50}
                alt="spinner"
              />
              <p className="text-white/80">Please wait...</p>
            </div>
          )}
        </div>
      ): (
        // Placeholder shown when no image is available
        <div className="transformed-placeholder">
          Transformed Image
        </div>
      )}
    </div>
  )
}

export default TransformedImage