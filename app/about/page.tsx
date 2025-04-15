import Image from "next/image"

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-3xl">
            Sky High Premium is dedicated to providing exceptional banking services and financial solutions to help our
            customers achieve their goals.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 1995, Sky High Premium began with a simple mission: to provide accessible, premium banking
                services that make a real difference in people's lives.
              </p>
              <p className="text-gray-700 mb-4">
                Over the past three decades, we've grown from a small local bank to an international financial
                institution serving millions of customers across the globe. Despite our growth, we remain committed to
                our founding principles of integrity, innovation, and personalized service.
              </p>
              <p className="text-gray-700">
                Today, Sky High Premium is recognized as a leader in digital banking solutions while maintaining the
                human touch that our customers value. We continue to invest in cutting-edge technology and exceptional
                talent to deliver banking experiences that exceed expectations.
              </p>
            </div>
            <div className="relative h-80 md:h-auto">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Bank building"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Integrity",
                description:
                  "We conduct our business with the highest ethical standards, ensuring transparency and honesty in all our interactions.",
              },
              {
                title: "Innovation",
                description:
                  "We continuously seek new ways to improve our services and create value for our customers through technological advancements.",
              },
              {
                title: "Excellence",
                description:
                  "We strive for excellence in everything we do, from customer service to financial solutions and security measures.",
              },
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-[#f0a500] rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-[#003366] mb-2">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] mb-12 text-center">Our Leadership</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Robert Johnson",
                title: "Chief Executive Officer",
                bio: "Robert has over 25 years of experience in the banking industry and has led Sky High Premium since 2015.",
              },
              {
                name: "Sarah Williams",
                title: "Chief Financial Officer",
                bio: "Sarah brings extensive financial expertise from her previous roles at major international banking institutions.",
              },
              {
                name: "David Chen",
                title: "Chief Technology Officer",
                bio: "David leads our digital transformation initiatives and is responsible for our cutting-edge banking technology.",
              },
            ].map((leader, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-40 h-40 bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=160&width=160`}
                    alt={leader.name}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#003366] mb-1">{leader.name}</h3>
                <p className="text-[#f0a500] font-semibold mb-2">{leader.title}</p>
                <p className="text-gray-700">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
