/**
 * Add Transformation Page
 *
 * This page component handles the creation of new image transformations.
 * It provides a dynamic interface based on the transformation type selected,
 * integrates with Clerk authentication, and manages user credits.
 *
 * Features:
 * - Dynamic transformation type handling
 * - User authentication check
 * - Credit balance verification
 * - Custom form per transformation type
 * - Responsive layout
 */

import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

/**
 * Renders the Add Transformation page with dynamic content based on transformation type
 * @param {SearchParamProps} props - Contains the transformation type from URL params
 * @returns {JSX.Element} Page component with header and transformation form
 */
const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  // Get authenticated user's ID from Clerk
  const { userId } = auth();

  // Get transformation configuration based on type
  const transformation = transformationTypes[type];

  // Redirect to sign-in if not authenticated
  if(!userId) redirect('/sign-in')

  // Fetch user details including credit balance
  const user = await getUserById(userId);

  return (
    <>
      {/* Display transformation-specific header */}
      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />

      {/* Render transformation form with user details and type */}
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

export default AddTransformationTypePage