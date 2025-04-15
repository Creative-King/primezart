import React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
        {
      "compilerOptions": {
        "jsx": "react",
        // other options
      }
    }
  )
})
Input.displayName = "Input"

export { Input }
