import Link from "next/link"

export function TopNavigation() {
  return (
    <div className="bg-[#003366] text-white">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        <Link href="/" className="font-medium">
          HOME
        </Link>
        <div className="flex space-x-4">
          <Link href="/personal" className="font-medium">
            PERSONAL
          </Link>
          <div className="border-l border-white/30 h-6 mx-2"></div>
          <Link href="/language" className="font-medium">
            SELECT LANGUAGE
          </Link>
          <div className="border-l border-white/30 h-6 mx-2"></div>
          <Link href="/sustainability" className="font-medium">
            SUSTAINABILITY
          </Link>
          <div className="border-l border-white/30 h-6 mx-2"></div>
          <Link href="/contact" className="font-medium">
            CONTACT
          </Link>
        </div>
      </div>
    </div>
  )
}
