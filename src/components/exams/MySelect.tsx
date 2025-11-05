import * as React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TOption = string
type TSelectProps = {
  data: TOption[]
  title: string
  onValueChange: React.Dispatch<React.SetStateAction<string>>
}
export function MySelect({ data, title, onValueChange }: TSelectProps) {
  return (
    <Select onValueChange={value => onValueChange(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {data.map(item => (
          <SelectItem value={item} key={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
