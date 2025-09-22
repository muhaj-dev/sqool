"use client"
import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DatePickerAdmin({ 
  title, 
  date, 
  onSelect 
}: { 
  title: string;
  date?: Date;
  onSelect: (date?: Date) => void;
}) {
  const [year, setYear] = React.useState<number>(date ? date.getFullYear() : new Date().getFullYear())
  const [month, setMonth] = React.useState<Date>(new Date(year, date ? date.getMonth() : 0))

  // Update month when year changes
  React.useEffect(() => {
    setMonth(new Date(year, month.getMonth()))
  }, [year])

  // Generate years from 1900 to current year + 10
  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years: number[] = []
    for (let i = 1900; i <= currentYear + 10; i++) {
      years.push(i)
    }
    return years
  }

  // Handle year selection
  const handleYearChange = (value: string) => {
    const newYear = parseInt(value)
    setYear(newYear)
    // If a date is already selected, update its year
    if (date) {
      const newDate = new Date(date)
      newDate.setFullYear(newYear)
      onSelect(newDate)
    }
  }

  // Handle date selection
  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      // Ensure the selected date uses the chosen year
      const newDate = new Date(selectedDate)
      newDate.setFullYear(year)
      onSelect(newDate)
      setMonth(new Date(year, newDate.getMonth()))
    } else {
      onSelect(undefined)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy-MM-dd") : <span>{title}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Select
            onValueChange={handleYearChange}
            value={year.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {generateYears().map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          defaultMonth={month}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}