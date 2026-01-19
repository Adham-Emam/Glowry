'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export default function Combobox({
  Icon,
  items,
  title,
}: {
  Icon: React.ComponentType<LucideProps>
  items: any[]
  title: string
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const querySlug = searchParams.get(title.toLowerCase())
    setValue(querySlug || '')
  }, [searchParams, title])

  const handleQueryUpdate = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (slug) {
      params.set(title.toLowerCase(), slug)
    } else {
      params.delete(title.toLowerCase())
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-fit p-6 bg-card border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm justify-between ${open ? 'ring-2 ring-primary/20 border-primary' : ''}`}
        >
          {value ? items.find((item) => item.slug === value)?.name : <Icon />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {title} found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setValue('')
                  setOpen(false)
                  handleQueryUpdate('')
                }}
              >
                All
              </CommandItem>

              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    const newValue = item.slug === value ? '' : item.slug
                    setValue(newValue)
                    setOpen(false)
                    handleQueryUpdate(newValue)
                  }}
                >
                  {item.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.slug ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
