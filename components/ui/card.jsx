import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-2xl border bg-white p-4 shadow", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = ({ className, ...props }) => (
  <div className={cn("mb-2", className)} {...props} />
)
const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-bold", className)} {...props} />
)
const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-gray-500", className)} {...props} />
)
const CardContent = ({ className, ...props }) => (
  <div className={cn("text-sm", className)} {...props} />
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent }