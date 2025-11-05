'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FormControl, FormField, FormItem, FormLabel, Form, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog } from '../ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import Requirement from '../Requirement'
import { useOnboarding } from '@/contexts/onboarding-context'
import { SchoolInformation } from '@/types/onboarding'

type MouseEvent = React.MouseEvent<HTMLButtonElement>
type StateProp = {
  label: string
  value: string
}

interface SchoolInfoFormProps {
  initialData: SchoolInformation
  onPrev: () => void
}

const SchoolInfoForm = ({ initialData, onPrev }: SchoolInfoFormProps) => {
  const { formData, updateFormData, goNextPage, goPrevPage, updateCompletionState } = useOnboarding()

  const [charCount, setCharCount] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [localGovernment, setLocalGovernment] = useState<StateProp[]>()
  const [states, setStates] = useState<StateProp[]>([])
  const [isLoadingStates, setIsLoadingStates] = useState(true)
  const [isLoadingLgas, setIsLoadingLgas] = useState(false)

  // Fetch all states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('https://nga-states-lga.onrender.com/fetch')
        const stateNames = await response.json()

        const formattedStates = stateNames.map((state: string) => ({
          label: state,
          value: state.toLowerCase().replace(/\s+/g, '-'),
        }))

        setStates(formattedStates)
        setIsLoadingStates(false)
      } catch (error) {
        console.error('Error fetching states:', error)
        setIsLoadingStates(false)
      }
    }

    fetchStates()
  }, [])

  // Fetch LGAs when state changes
  const fetchLgas = async (state: string) => {
    if (!state) return

    setIsLoadingLgas(true)
    try {
      const response = await fetch(`https://nga-states-lga.onrender.com/?state=${state}`)
      const lgaNames = await response.json()

      const formattedLgas = lgaNames.map((lga: string) => ({
        label: lga,
        value: lga.toLowerCase().replace(/\s+/g, '-'),
      }))

      setLocalGovernment(formattedLgas)
    } catch (error) {
      console.error('Error fetching LGAs:', error)
    } finally {
      setIsLoadingLgas(false)
    }
  }

  const schoolType = [
    { label: 'Primary', value: 'Primary School' },
    { label: 'Secondary', value: 'Secondary School' },
    { label: 'Both', value: 'Combined School' },
    { label: 'Sixth Form', value: 'Sixth Form' },
  ]

  const statesData = [
    {
      label: 'Oyo',
      value: 'oyo',
      localGovernments: [
        { label: 'Ido', value: 'ido' },
        { label: 'Egbeda', value: 'egbeda' },
        { label: 'Ibadan-North', value: 'ibadan-north' },
        { label: 'Akinyele', value: 'akinyele' },
      ],
    },
    {
      label: 'Lagos',
      value: 'lagos',
      localGovernments: [
        { label: 'Ido', value: 'ido' },
        { label: 'Egbeda', value: 'egbeda' },
        { label: 'Ibadan-North', value: 'ibadan-north' },
        { label: 'Akinyele', value: 'akinyele' },
      ],
    },
    {
      label: 'Osun',
      value: 'osun',
      localGovernments: [
        { label: 'Ido', value: 'ido' },
        { label: 'Egbeda', value: 'egbeda' },
        { label: 'Ibadan-North', value: 'ibadan-north' },
        { label: 'Akinyele', value: 'akinyele' },
      ],
    },
    {
      label: 'Ogun',
      value: 'ogun',
      localGovernments: [
        { label: 'Ido', value: 'ido' },
        { label: 'Egbeda', value: 'egbeda' },
        { label: 'Ibadan-North', value: 'ibadan-north' },
        { label: 'Akinyele', value: 'akinyele' },
      ],
    },
  ]

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'School name must be at least 2 characters' }),
    description: z
      .string()
      .min(2, { message: 'About school must be at least 2 characters' })
      .max(500, { message: 'About school cannot be more than 500 characters' }),
    address: z.object({
      schoolAddress: z.string().min(2, { message: 'School address must be at least 2 characters' }),
      localGovernment: z.string().min(2, { message: 'Please select a local government' }),
      state: z.string().min(2, { message: 'Please select a state' }),
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: formData.SchoolInformation.name,
      description: formData.SchoolInformation.description,
      address: {
        schoolAddress: formData.SchoolInformation.address.schoolAddress,
        localGovernment: formData.SchoolInformation.address.localGovernment,
        state: formData.SchoolInformation.address.state,
      },
    },
  })

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    updateFormData('SchoolInformation', {
      ...data,
      schoolType: schoolType[activeIndex].value,
    })
    console.log(data, schoolType[activeIndex].value)
    console.log(formData)
    updateCompletionState('School Information')
    goNextPage()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-white rounded-md py-4 sm:p-4 space-y-6">
        {/* School Type Selection */}
        <div className="border-b-2 grid grid-cols-1 lg:grid-cols-2">
          <span>Type of school</span>
          <div className="flex flex-col gap-4 mb-4">
            <p>School Type</p>
            <div className="grid grid-cols-2 gap-4">
              {schoolType.map((item, i) => {
                const handleOpen = (e: MouseEvent) => {
                  e.preventDefault()
                  setActiveIndex(i)
                }

                const isOpen = i === activeIndex
                return (
                  <div key={item.label}>
                    <Button
                      onClick={handleOpen}
                      className={cn('shadow-sm border w-full text-muted-foreground', {
                        'bg-[rgba(0,0,0,0.05)] text-primary': isOpen,
                      })}
                      variant={isOpen ? 'secondary' : 'ghost'}
                    >
                      {item.label}
                    </Button>
                  </div>
                )
              })}
            </div>
            <Dialog>
              <DialogTrigger>
                <span className="text-sm text-primary underline cursor-pointer">
                  View the requirement document we need
                </span>
              </DialogTrigger>
              <Requirement />
            </Dialog>
          </div>
        </div>

        {/* School Name */}
        <div className="border-b-2 grid grid-col-1 md:grid-cols-2 gap-2 py-4">
          <div className="w-full max-w-[24.5rem]">
            <h3>Tell us your School Register</h3>
            <p className="text-sm text-muted-foreground">
              This must be the name on your registration Documentation.
              <span className="text-red-600">Note: the name cannot be changed again</span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your School name</FormLabel>
                  <FormControl>
                    <Input placeholder="PURS" type="text" className="sm:w-[25rem]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* School Description */}
        <div className="border-b-2 grid md:grid-cols-2 gap-2 py-4">
          <div className="w-full max-w-[24.5rem]">
            <h3>Tell us about your School</h3>
            <p className="text-sm text-muted-foreground">
              In a few sentences describe your school and the services you provide
            </p>
          </div>
          <div className="grid gap-1.5 mt-4 sm:mt-0 w-full max-w-[25rem]">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About your School</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your school..."
                      className="resize-none"
                      rows={8}
                      maxLength={500}
                      {...field}
                      onChange={e => {
                        setCharCount(e.target.value.length)
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Maximum 500 characters.</p>
              <div className="flex items-center text-muted-foreground text-sm">
                <span>{charCount}</span>
                <span>/</span>
                <span>500</span>
              </div>
            </div>
          </div>
        </div>

        {/* School Location */}
        <div className="border-b-2 grid md:grid-cols-2 gap-2 py-4">
          <div className="w-full max-w-[24.5rem]">
            <h3>Verify your School Location</h3>
            <p className="text-sm text-muted-foreground">
              We will require you to submit a copy of your utility bill associated with this address in the
              documentation section
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-4 sm:mt-0 w-full max-w-[25rem]">
            <FormField
              control={form.control}
              name="address.schoolAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Address</FormLabel>
                  <FormControl>
                    <Input placeholder="School address" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State Select Field */}
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={stateValue => {
                      field.onChange(stateValue)
                      // Find the state name by value
                      const selectedState = states.find(s => s.value === stateValue)
                      if (selectedState) {
                        fetchLgas(selectedState.label)
                      }
                    }}
                    defaultValue={field.value}
                    disabled={isLoadingStates}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingStates ? 'Loading states...' : 'Select a state'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LGA Select Field */}
            <FormField
              control={form.control}
              name="address.localGovernment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local government area</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!localGovernment || isLoadingLgas}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingLgas
                              ? 'Loading LGAs...'
                              : localGovernment
                                ? 'Select a Local Government'
                                : 'Please select a state first'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {localGovernment?.map(item => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={goPrevPage}>
            Back
          </Button>
          <Button type="submit" className="text-white w-full max-w-[25rem] text-lg">
            Save and Continue
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SchoolInfoForm
