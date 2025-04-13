"use client"

import * as React from "react"
import type * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    orientation?: "vertical" | "horizontal"
  }
>(({ className, children, orientation = "vertical", ...props }, ref) => (
  <div ref={ref} className={cn("relative overflow-auto", className)} {...props}>
    <div className="h-full w-full">{children}</div>
  </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
