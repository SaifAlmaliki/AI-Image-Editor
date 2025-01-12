/**
 * Home Page Component
 *
 * This is the main landing page of the Imaginify application. It displays:
 * 1. A hero section with the application title
 * 2. Quick access navigation links with icons
 * 3. A collection of images with search and pagination functionality
 *
 * The page handles search parameters for pagination and search queries,
 * fetching the appropriate images from the database.
 */

import { Collection } from "@/components/shared/Collection"
import { navLinks } from "@/constants"
import { getAllImages } from "@/lib/actions/image.actions"
import Image from "next/image"
import Link from "next/link"

// Define the Home component with search parameters support
const Home = async ({ searchParams }: SearchParamProps) => {
  // Extract and normalize page number and search query from URL parameters
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || '';

  // Fetch images based on current page and search query
  const images = await getAllImages({ page, searchQuery})

  return (
    <>
      {/* Hero section with main heading */}
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with Imaginify
        </h1>

        {/* Navigation links with icons */}
        <ul className="flex-center w-full gap-20">
          {/* Display only the middle 4 navigation items */}
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              {/* Circular icon container */}
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      {/* Image collection section with search and pagination */}
      <section className="sm:mt-12">
        <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  )
}

export default Home