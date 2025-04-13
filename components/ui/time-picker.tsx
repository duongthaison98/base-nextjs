"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hours, setHours] = React.useState<string>(value ? value.split(":")[0] : "12")
  const [minutes, setMinutes] = React.useState<string>(value ? value.split(":")[1] : "00")
  const [period, setPeriod] = React.useState<"AM" | "PM">(
    value ? (Number.parseInt(value.split(":")[0]) >= 12 ? "PM" : "AM") : "AM",
  )

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      const hour = Number.parseInt(h)
      setHours(hour > 12 ? String(hour - 12).padStart(2, "0") : String(hour).padStart(2, "0"))
      setMinutes(m)
      setPeriod(hour >= 12 ? "PM" : "AM")
    }
  }, [value])

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value.replace(/[^\d]/g, "").slice(0, 2)
    if (newHours === "" || (Number.parseInt(newHours) >= 1 && Number.parseInt(newHours) <= 12)) {
      setHours(newHours)
      updateTime(newHours, minutes, period)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value.replace(/[^\d]/g, "").slice(0, 2)
    if (newMinutes === "" || (Number.parseInt(newMinutes) >= 0 && Number.parseInt(newMinutes) <= 59)) {
      setMinutes(newMinutes)
      updateTime(hours, newMinutes, period)
    }
  }

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod)
    updateTime(hours, minutes, newPeriod)
  }

  const updateTime = (h: string, m: string, p: "AM" | "PM") => {
    if (h && m) {
      let hour = Number.parseInt(h)
      if (p === "PM" && hour < 12) hour += 12
      if (p === "AM" && hour === 12) hour = 0
      onChange(`${hour.toString().padStart(2, "0")}:${m.padStart(2, "0")}`)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value ? `${hours}:${minutes} ${period}` : <span>Pick a time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex items-center space-x-2">
            <Input className="w-14" value={hours} onChange={handleHoursChange} placeholder="HH" />
            <span className="text-lg">:</span>
            <Input className="w-14" value={minutes} onChange={handleMinutesChange} placeholder="MM" />
            <Select value={period} onValueChange={(value) => handlePeriodChange(value as "AM" | "PM")}>
              <SelectTrigger className="w-16">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
