import type { LucideIcon } from "lucide-react"

interface ServiceIconProps {
  icon: LucideIcon
  label: string
}

export function ServiceIcon({ icon: Icon, label }: ServiceIconProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#F0A500] rounded-full p-4 mb-2">
        <Icon className="h-6 w-6 text-[#003366]" />
      </div>
      <span className="text-white text-xs text-center">{label}</span>
    </div>
  )
}

