/**
 * CustomField Component
 *
 * A reusable form field wrapper component that integrates with react-hook-form
 * and provides consistent styling and validation handling across the application.
 *
 * Features:
 * - Seamless integration with react-hook-form
 * - Type-safe form validation using Zod
 * - Flexible rendering through render props pattern
 * - Consistent form field layout and styling
 * - Optional label support
 * - Error message handling
 */

import React from "react";
import { Control } from "react-hook-form";
import { z } from "zod";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "../ui/form";
import { formSchema } from "./TransformationForm";

/**
 * Props for the CustomField component
 * @property {Control} control - Form control from react-hook-form
 * @property {Function} render - Render prop function for custom field content
 * @property {string} name - Field name from the form schema
 * @property {string} [formLabel] - Optional label text for the field
 * @property {string} [className] - Optional CSS class names
 */
type CustomFieldProps = {
  control: Control<z.infer<typeof formSchema>> | undefined;
  render: (props: { field: any }) => React.ReactNode;
  name: keyof z.infer<typeof formSchema>;
  formLabel?: string;
  className?: string;
};

/**
 * A customizable form field component that provides consistent layout and behavior
 *
 * @param {CustomFieldProps} props - Component properties
 * @param {Control} props.control - Form control instance from react-hook-form
 * @param {Function} props.render - Function to render the actual input element
 * @param {string} props.name - Name of the form field
 * @param {string} [props.formLabel] - Optional label for the field
 * @param {string} [props.className] - Optional CSS classes
 *
 * @returns {JSX.Element} A form field with consistent styling and validation
 */
export const CustomField = ({
  control,
  render,
  name,
  formLabel,
  className,
}: CustomFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {/* Render label if provided */}
          {formLabel && <FormLabel>{formLabel}</FormLabel>}

          {/* Render custom field input */}
          <FormControl>{render({ field })}</FormControl>

          {/* Display validation error messages */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};