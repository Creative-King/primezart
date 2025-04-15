import Image from "next/image"
import Link from "next/link"
import { CreditCard, Shield, Smartphone, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SimplicityInPayments() {
  return (
    <div className="w-full bg-gradient-to-br from-[#001233] via-[#003366] to-[#0047ab] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-block bg-blue-500/20 px-4 py-2 rounded-full">
              <span className="text-sm font-medium">Sky Premium Cards</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Simplicity in <br />
              Every Payment
            </h2>
            <p className="text-lg text-gray-200 max-w-lg">
              Experience seamless transactions with our premium cards. Designed for your convenience, security, and
              financial freedom, wherever life takes you.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Instant Transactions</h3>
                  <p className="text-gray-300">Complete payments in seconds with our high-speed processing network</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Enhanced Security</h3>
                  <p className="text-gray-300">
                    Advanced encryption and real-time fraud monitoring to protect your finances
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Globe className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Global Acceptance</h3>
                  <p className="text-gray-300">
                    Use your card at millions of locations worldwide with zero foreign transaction fees
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/dashboard/cards/request">
                <Button className="bg-[#f0a500] hover:bg-[#e09400] text-black px-6 py-6 h-auto text-lg">
                  Request Your Card
                </Button>
              </Link>
              <Link href="/dashboard/cards">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-6 py-6 h-auto text-lg"
                >
                  Manage Cards
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="relative h-[400px] w-full md:h-[500px]">
              <div className="absolute top-0 right-0 w-[300px] h-[180px] bg-gradient-to-br from-[#f0a500] to-[#f08700] rounded-xl shadow-xl transform rotate-6 z-10">
                <div className="p-6 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div className="text-sm opacity-80">Sky Premium</div>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="font-mono text-lg">**** **** **** 4532</div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <div className="opacity-70">Valid Thru</div>
                        <div>05/28</div>
                      </div>
                      <div className="h-8 w-8 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-[100px] left-[50px] w-[300px] h-[180px] bg-gradient-to-br from-[#003366] to-[#0047ab] rounded-xl shadow-xl transform -rotate-3 z-20">
                <div className="p-6 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div className="text-sm opacity-80">Sky Premium</div>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="font-mono text-lg">**** **** **** 7890</div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <div className="opacity-70">Valid Thru</div>
                        <div>09/27</div>
                      </div>
                      <div className="h-8 w-8 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-[30px] w-[250px] h-[500px] bg-black/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden z-0">
                <div className="relative h-full w-full">
                  <Image
                    src="/placeholder.svg?height=500&width=250"
                    alt="Mobile banking app"
                    fill
                    className="object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Smartphone className="h-10 w-10 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Mobile Control</h3>
                    <p className="text-sm">Manage your cards directly from our secure mobile app</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
