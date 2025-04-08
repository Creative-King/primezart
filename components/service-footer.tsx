import { User, Gift, Phone, MapPin, FileText, Calculator, MessageSquare } from "lucide-react"

export function ServiceFooter() {
  return (
    <div className="bg-[#003366] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-7 gap-4">
          {[
            { icon: <User className="h-6 w-6" />, label: "Open Account" },
            { icon: <Gift className="h-6 w-6" />, label: "Apply Online" },
            { icon: <Phone className="h-6 w-6" />, label: "Contact Us" },
            { icon: <MapPin className="h-6 w-6" />, label: "Find a Branch" },
            { icon: <FileText className="h-6 w-6" />, label: "Apply for Loan" },
            { icon: <Calculator className="h-6 w-6" />, label: "Loan Calculator" },
            { icon: <MessageSquare className="h-6 w-6" />, label: "Complaints" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-[#F0A500] rounded-full p-4 mb-2">{item.icon}</div>
              <span className="text-white text-xs text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

