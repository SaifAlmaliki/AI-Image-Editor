/**
 * MediaUploader Component
 *
 * A React component that handles image upload functionality using Cloudinary.
 * This component provides a user interface for uploading images and displays
 * the uploaded image preview. It integrates with Cloudinary for image storage
 * and management.
 *
 * Features:
 * - Single image upload
 * - Image preview after upload
 * - Success/Error notifications
 * - Responsive image display
 * - Credit tracking for uploads
 */

"use client";

import { useToast } from "@/components/ui/use-toast"
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

// Type definition for component props
type MediaUploaderProps = {
  onValueChange: (value: string) => void;  // Callback function when value changes
  setImage: React.Dispatch<any>;           // State setter for image data
  publicId: string;                        // Cloudinary public ID for the image
  image: any;                              // Image data object
  type: string;                            // Type of transformation
}

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type
}: MediaUploaderProps) => {
  // Initialize toast notification hook
  const { toast } = useToast()

  // Handler for successful image upload
  const onUploadSuccessHandler = (result: any) => {
    // Update image state with new upload information
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url
    }))

    // Notify parent component of the new public ID
    onValueChange(result?.info?.public_id)

    // Show success notification
    toast({
      title: 'Image uploaded successfully',
      description: '1 credit was deducted from your account',
      duration: 5000,
      className: 'success-toast'
    })
  }

  // Handler for upload errors
  const onUploadErrorHandler = () => {
    toast({
      title: 'Something went wrong while uploading',
      description: 'Please try again',
      duration: 5000,
      className: 'error-toast'
    })
  }

  return (
    <CldUploadWidget
      uploadPreset="saif_imaginify"
      options={{
        multiple: false,           // Disable multiple file selection
        resourceType: "image",     // Only allow image uploads
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">
            Original
          </h3>

          {/* Conditional rendering based on whether an image has been uploaded */}
          {publicId ? (
            <>
              <div className="cursor-pointer overflow-hidden rounded-[10px]">
                <CldImage
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt="image"
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="media-uploader_cldImage"
                />
              </div>
            </>
          ): (
            // Upload CTA shown when no image is selected
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
                <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default MediaUploader