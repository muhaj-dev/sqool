'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { FeeStructure } from '@/types'

// Dynamic breakdown schema - now supports any fee types
const createTermBreakdownSchema = (feeTypes: string[]) => {
  const schema: any = {}
  feeTypes.forEach(feeType => {
    schema[feeType] = z.number().min(0, `${feeType} must be positive`)
  })
  return z.object(schema)
}

const termSchema = z.object({
  term: z.enum(['first', 'second', 'third']),
  amount: z.number().min(0, 'Term amount must be positive'),
  breakdown: z.record(z.string(), z.number().min(0)), // Dynamic breakdown
})

const feeSchema = z.object({
  class: z.string().min(1, 'Class is required'),
  session: z.string().min(1, 'Session is required'),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  terms: z.array(termSchema).min(1, 'At least one term is required'),
})

type FeeFormData = z.infer<typeof feeSchema>

// Default fee types
const DEFAULT_FEE_TYPES = ['tuition', 'examination']

// Helper function to get initial form values
const getInitialFormValues = (): FeeFormData => ({
  class: '',
  session: '',
  totalAmount: 0,
  terms: [
    {
      term: 'first' as const,
      amount: 0,
      breakdown: { tuition: 0, excursion: 0 },
    },
  ],
})

interface FeeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditMode: boolean
  selectedFee: FeeStructure | null
  classes: any[]
  sessions: any[]
  onSubmit: (data: FeeFormData) => Promise<void>
  onCancel: () => void
}

export function FeeFormDialog({
  open,
  onOpenChange,
  isEditMode,
  selectedFee,
  classes,
  sessions,
  onSubmit,
  onCancel,
}: FeeFormDialogProps) {
  const [currentTerm, setCurrentTerm] = useState<'first' | 'second' | 'third'>('first')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [feeTypes, setFeeTypes] = useState<string[]>(DEFAULT_FEE_TYPES)
  const [newFeeType, setNewFeeType] = useState('')
  const { toast } = useToast()

  const form = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: getInitialFormValues(),
    mode: 'onChange',
  })

  const watchedTerms = form.watch('terms')
  const watchedTotalAmount = form.watch('totalAmount')

  // Get current term data
  const currentTermData = watchedTerms.find(t => t.term === currentTerm)
  const currentTermIndex = watchedTerms.findIndex(t => t.term === currentTerm)

  // Force re-render when current term changes by using a key
  const termFormKey = `term-${currentTerm}-${currentTermIndex}`

  // Reset form when dialog opens/closes or selected fee changes
  useEffect(() => {
    if (open) {
      if (isEditMode && selectedFee) {
        // Extract all unique fee types from the fee structure
        const allFeeTypes = new Set<string>()
        selectedFee?.terms?.forEach(term => {
          Object.keys(term?.breakdown).forEach(key => {
            allFeeTypes.add(key)
          })
        })

        setFeeTypes(Array.from(allFeeTypes))

        const formData = {
          class: typeof selectedFee?.class === 'string' ? selectedFee?.class : selectedFee?.class?._id,
          session: typeof selectedFee?.session === 'string' ? selectedFee?.session : (selectedFee?.session as any)._id,
          totalAmount: selectedFee.totalAmount,
          terms: selectedFee.terms,
        }

        form.reset(formData)

        if (selectedFee.terms.length > 0) {
          setCurrentTerm(selectedFee.terms[0].term)
        }
      } else {
        form.reset(getInitialFormValues())
        setCurrentTerm('first')
        setFeeTypes(DEFAULT_FEE_TYPES)
      }
    }
  }, [open, isEditMode, selectedFee, form])

  // Auto-calculate term amount and total when breakdown changes
  const calculateTermAmount = (termIndex: number) => {
    const breakdown = form.getValues(`terms.${termIndex}.breakdown`)
    const termTotal = Object.values(breakdown).reduce((sum: number, val) => sum + (Number(val) || 0), 0)

    form.setValue(`terms.${termIndex}.amount`, termTotal, {
      shouldValidate: true,
    })

    // Recalculate total amount
    const allTerms = form.getValues('terms')
    const totalAmount = allTerms.reduce((sum, term) => sum + term.amount, 0)
    form.setValue('totalAmount', totalAmount, { shouldValidate: true })
  }

  // Handle breakdown field changes
  const handleBreakdownChange = (termIndex: number, field: string, value: number) => {
    form.setValue(`terms.${termIndex}.breakdown.${field}`, value, {
      shouldValidate: true,
    })
    calculateTermAmount(termIndex)
  }

  // Add new fee type
  const addFeeType = () => {
    if (!newFeeType.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a fee type name',
        variant: 'destructive',
      })
      return
    }

    const formattedFeeType = newFeeType.trim().toLowerCase().replace(/\s+/g, '_')

    if (feeTypes.includes(formattedFeeType)) {
      toast({
        title: 'Error',
        description: 'This fee type already exists',
        variant: 'destructive',
      })
      return
    }

    // Add to fee types
    setFeeTypes(prev => [...prev, formattedFeeType])

    // Initialize this fee type for all existing terms with value 0
    const currentTerms = form.getValues('terms')
    const updatedTerms = currentTerms.map(term => ({
      ...term,
      breakdown: {
        ...term.breakdown,
        [formattedFeeType]: 0,
      },
    }))

    form.setValue('terms', updatedTerms, { shouldValidate: true })
    setNewFeeType('')

    // Recalculate totals
    calculateTermAmount(currentTermIndex)
  }

  // Remove fee type
  const removeFeeType = (feeTypeToRemove: string) => {
    if (feeTypes.length <= 1) {
      toast({
        title: 'Error',
        description: 'At least one fee type is required',
        variant: 'destructive',
      })
      return
    }

    // Remove from fee types
    setFeeTypes(prev => prev.filter(type => type !== feeTypeToRemove))

    // Remove this fee type from all terms
    const currentTerms = form.getValues('terms')
    const updatedTerms = currentTerms.map(term => {
      const { [feeTypeToRemove]: removed, ...newBreakdown } = term.breakdown
      return {
        ...term,
        breakdown: newBreakdown,
      }
    })

    form.setValue('terms', updatedTerms, { shouldValidate: true })

    // Recalculate totals
    calculateTermAmount(currentTermIndex)
  }

  // Improved term management functions
  const addTerm = (termName: 'first' | 'second' | 'third') => {
    const currentTerms = form.getValues('terms')
    const termExists = currentTerms.find(t => t.term === termName)

    if (!termExists) {
      // Initialize breakdown with all current fee types set to 0
      const initialBreakdown: Record<string, number> = {}
      feeTypes.forEach(type => {
        initialBreakdown[type] = 0
      })

      const newTerm = {
        term: termName,
        amount: 0,
        breakdown: initialBreakdown,
      }

      const updatedTerms = [...currentTerms, newTerm]
      form.setValue('terms', updatedTerms, { shouldValidate: true })

      const totalAmount = updatedTerms.reduce((sum, term) => sum + term.amount, 0)
      form.setValue('totalAmount', totalAmount, { shouldValidate: true })
    }

    setCurrentTerm(termName)
  }

  const removeTerm = (termName: 'first' | 'second' | 'third') => {
    const currentTerms = form.getValues('terms')
    if (currentTerms.length <= 1) {
      toast({
        title: 'Cannot remove',
        description: 'At least one term is required',
        variant: 'destructive',
      })
      return
    }

    const updatedTerms = currentTerms.filter(t => t.term !== termName)
    form.setValue('terms', updatedTerms, { shouldValidate: true })

    const totalAmount = updatedTerms.reduce((sum, term) => sum + term.amount, 0)
    form.setValue('totalAmount', totalAmount, { shouldValidate: true })

    if (currentTerm === termName && updatedTerms.length > 0) {
      setCurrentTerm(updatedTerms[0].term)
    }
  }

  // Get available terms that can be added
  const availableTerms = (['first', 'second', 'third'] as const).filter(
    term => !watchedTerms.find(t => t.term === term),
  )

  // Format classes for dropdown
  const classOptions = classes.map(cls => ({
    value: cls._id,
    label: `${cls.className} (${cls.shortName})`,
  }))

  // Format sessions for dropdown
  const sessionOptions = sessions.map(session => ({
    value: session._id,
    label: session.session,
  }))

  const handleFormSubmit = async (data: FeeFormData) => {
    setFormSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleCancel = () => {
    onCancel()
    form.reset(getInitialFormValues())
    setFeeTypes(DEFAULT_FEE_TYPES)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Fee Structure' : 'Create Fee Structure'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the fee structure for the selected class and session.'
              : 'Set up fee structure for a class and session. Add fees for each term separately.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classOptions.map(cls => (
                          <SelectItem key={cls.value} value={cls.value}>
                            {cls.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isEditMode && (
                      <FormDescription className="text-xs">Class cannot be changed during edit</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Session</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessionOptions.map(session => (
                          <SelectItem key={session.value} value={session.value}>
                            {session.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isEditMode && (
                      <FormDescription className="text-xs">Session cannot be changed during edit</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Custom Fee Types Management */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Fee Types</CardTitle>
                <CardDescription>
                  Add or remove different types of fees. These will be available for all terms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new fee type (e.g., books, sports, pta)"
                    value={newFeeType}
                    onChange={e => setNewFeeType(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeeType())}
                  />
                  <Button type="button" onClick={addFeeType}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Type
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {feeTypes.map(feeType => (
                    <Badge key={feeType} variant="secondary" className="px-3 py-1 text-sm">
                      {feeType.replace(/_/g, ' ')}
                      <button
                        type="button"
                        onClick={() => removeFeeType(feeType)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Term Fees</h3>
                <div className="flex gap-2 flex-wrap">
                  {(['first', 'second', 'third'] as const).map(term => {
                    const termExists = watchedTerms.find(t => t.term === term)
                    return (
                      <div key={term} className="flex gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant={currentTerm === term ? 'default' : termExists ? 'secondary' : 'outline'}
                          onClick={() => (termExists ? setCurrentTerm(term) : addTerm(term))}
                        >
                          {term.charAt(0).toUpperCase() + term.slice(1)} Term
                          {termExists && ` - ₦${watchedTerms.find(t => t.term === term)?.amount.toLocaleString()}`}
                        </Button>
                        {termExists && watchedTerms.length > 1 && (
                          <Button type="button" size="sm" variant="destructive" onClick={() => removeTerm(term)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Add Term Button for available terms */}
              {availableTerms.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Add more terms:</p>
                  <div className="flex gap-2">
                    {availableTerms.map(term => (
                      <Button key={term} type="button" size="sm" variant="outline" onClick={() => addTerm(term)}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add {term.charAt(0).toUpperCase() + term.slice(1)} Term
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Term Form - Dynamic Fee Types */}
              {currentTermData && currentTermIndex !== -1 && (
                <div key={termFormKey} className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {feeTypes.map(feeType => (
                      <FormField
                        key={feeType}
                        control={form.control}
                        name={`terms.${currentTermIndex}.breakdown.${feeType}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">{feeType.replace(/_/g, ' ')} Fee (₦)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                value={field.value || 0}
                                onChange={e => {
                                  const value = Number(e.target.value)
                                  field.onChange(value)
                                  handleBreakdownChange(currentTermIndex, feeType, value)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                    <p className="text-sm font-medium">
                      {currentTerm.charAt(0).toUpperCase() + currentTerm.slice(1)} Term Total:
                      <span className="text-primary ml-2 text-lg">₦{currentTermData.amount.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
              <p className="text-lg font-bold">
                Total Annual Fee:
                <span className="text-primary ml-2 text-2xl">₦{watchedTotalAmount.toLocaleString()}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {watchedTerms.length} term(s) configured • {feeTypes.length} fee type(s)
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting || !form.formState.isValid}>
                {formSubmitting ? 'Saving...' : isEditMode ? 'Update Fee Structure' : 'Create Fee Structure'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}