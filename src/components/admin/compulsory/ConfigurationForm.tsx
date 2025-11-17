'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight, Search, School, Pencil, Trash2 } from 'lucide-react'
import { createClasses, getClasses, editClasses, deleteClasses } from '@/utils/api'
import { IClassConfiguration, IClassConfigurationResponse } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  AlertDialog, 
  AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

export const formSchema = z.object({
  classname: z.string().min(3).max(50),
  shortname: z.string().min(1).max(25),
  leveltype: z.string().min(1),
  classSection: z.string().max(2, 'Section must be at most 2 characters'),
})

interface FORMTYPE extends z.infer<typeof formSchema> {
  edited?: boolean
  index?: number
  id?: string
  createdAt?: string
  updatedAt?: string
}

interface ConfigurationFormProps {
  classType?: string
}

interface PaginatedResponse {
  data: {
    result: IClassConfigurationResponse[]
    pagination: {
      total: number
      currentPage: string
      pageSize: number
    }
  }
}

type PropertyKey = 'classname' | 'shortname' | 'leveltype' | 'classSection'

const LIMIT_OPTIONS = ['10', '20', '50']

function filterUniqueValues(data: FORMTYPE[]) {
  const uniqueValues: FORMTYPE[] = []
  for (const obj of data) {
    if (!uniqueValues.some(uObj => areObjectEqual(uObj, obj))) {
      uniqueValues.push(obj)
    }
  }
  return uniqueValues
}

function areObjectEqual(obj1: FORMTYPE, obj2: FORMTYPE) {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false

  const keys1 = Object.keys(obj1).filter(
    key => key !== 'index' && key !== 'edited' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt',
  )
  const keys2 = Object.keys(obj2).filter(
    key => key !== 'index' && key !== 'edited' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt',
  )
  if (keys1.length !== keys2.length) return false
  for (const key of keys1) {
    if (obj1[key as PropertyKey] !== obj2[key as PropertyKey]) return false
  }
  return true
}

const ConfigurationForm = ({ classType }: ConfigurationFormProps) => {
  const [classes, setClasses] = useState<FORMTYPE[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [page, setPage] = useState('1')
  const [limit, setLimit] = useState('10')
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<FORMTYPE | null>(null)

  // Main form for creating classes
  const createForm = useForm<FORMTYPE>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edited: false,
      classname: '',
      shortname: '',
      leveltype: classType || 'primary',
      classSection: '',
    },
  })

  // Separate form for editing classes
  const editForm = useForm<FORMTYPE>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edited: false,
      classname: '',
      shortname: '',
      leveltype: classType || 'primary',
      classSection: '',
    },
  })

  const { reset: resetCreateForm } = createForm
  const { reset: resetEditForm, setValue: setEditFormValue } = editForm

  useEffect(() => {
    if (classType) {
      createForm.setValue('leveltype', classType.toLowerCase())
      editForm.setValue('leveltype', classType.toLowerCase())
    }
  }, [classType, createForm, editForm])

  useEffect(() => {
    if (classType) {
      resetCreateForm({
        edited: false,
        classname: '',
        shortname: '',
        leveltype: classType.toLowerCase(),
        classSection: '',
      })
      resetEditForm({
        edited: false,
        classname: '',
        shortname: '',
        leveltype: classType.toLowerCase(),
        classSection: '',
      })
    }
  }, [classType, resetCreateForm, resetEditForm])

  async function fetchClasses() {
    try {
      const response = await getClasses(page, limit)
      console.log('Fetched classes:', response)
      setClasses(
        response.data.result.map((cls, index) => ({
          ...cls,
          classname: cls.className,
          shortname: cls.shortName,
          leveltype: cls.levelType,
          classSection: cls.classSection || '',
          id: cls._id,
          edited: false,
          index,
        })),
      )
      setTotalItems(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [page, limit])

  // Handle creating new classes
  async function handleCreateClass(value: FORMTYPE) {
    try {
      setIsSubmitting(true)

      const classData: IClassConfiguration = {
        className: value.classname,
        shortName: value.shortname,
        levelType: value.leveltype.toLowerCase() as 'nursery' | 'primary' | 'secondary',
        classSection: value.classSection,
      }

      await createClasses(classData)
      toast({ title: "Class created successfully" })

      // Reset to first page and fetch updated classes from API
      setPage('1')
      await fetchClasses()

      // Reset form
      resetCreateForm({
        edited: false,
        classname: '',
        shortname: '',
        leveltype: classType || 'primary',
        classSection: '',
      })

    } catch (error) {
      console.error('Error creating class:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create class"
      toast({ title: errorMessage, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle editing classes
  async function handleEditClass(value: FORMTYPE) {
    try {
      setIsSubmitting(true)

      if (!selectedClass?.id) {
        throw new Error("No class selected for editing")
      }

      const classData: IClassConfiguration = {
        className: value.classname,
        shortName: value.shortname,
        levelType: value.leveltype.toLowerCase() as 'nursery' | 'primary' | 'secondary',
        classSection: value.classSection,
      }

      await editClasses(selectedClass.id, classData)
      toast({ title: "Class updated successfully" })

      // Reset to first page and fetch updated classes from API
      setPage('1')
      await fetchClasses()

      // Close edit dialog and reset
      setEditDialogOpen(false)
      setSelectedClass(null)
      resetEditForm({
        edited: false,
        classname: '',
        shortname: '',
        leveltype: classType || 'primary',
        classSection: '',
      })

    } catch (error) {
      console.error('Error editing class:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update class"
      toast({ title: errorMessage, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteClass() {
    if (!selectedClass?.id) return

    try {
      await deleteClasses(selectedClass.id)
      toast({ title: "Class deleted successfully" })
      
      // Reset to first page and fetch updated classes from API
      setPage('1')
      await fetchClasses()
      
      setDeleteDialogOpen(false)
      setSelectedClass(null)
    } catch (error) {
      console.error('Error deleting class:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete class"
      toast({ title: errorMessage, variant: "destructive" })
    }
  }

  function onEdit(item: FORMTYPE) {
    setSelectedClass(item)
    // Set values in the edit form only, not the create form
    setEditFormValue('classname', item.classname, { shouldValidate: true })
    setEditFormValue('leveltype', item.leveltype, { shouldValidate: true })
    setEditFormValue('shortname', item.shortname, { shouldValidate: true })
    setEditFormValue('classSection', item.classSection, { shouldValidate: true })
    setEditDialogOpen(true)
  }

  function onDelete(item: FORMTYPE) {
    setSelectedClass(item)
    setDeleteDialogOpen(true)
  }

  // Filter classes based on search term only (no level type filtering)
  const filteredClasses = classes.filter(cls => 
    cls.classname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.shortname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.leveltype.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalItems / parseInt(limit))
  const currentPage = parseInt(page)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage((currentPage - 1).toString())
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage((currentPage + 1).toString())
    }
  }

  const handleLimitChange = (value: string) => {
    setLimit(value)
    setPage('1')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Form Card - Full width */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Enter your classes information
              </CardTitle>
              <CardDescription>
                {classType
                  ? `Configure your ${classType} classes`
                  : 'Create and manage all your classes in one place'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateClass)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="classname"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="className">Class Name</Label>
                          <FormControl>
                            <Input
                              id="className"
                              placeholder="Enter class name..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="shortname"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="shortName">Short Name</Label>
                          <FormControl>
                            <Input
                              id="shortName"
                              placeholder="Enter a short name..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="leveltype"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="levelType">Level Type</Label>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                            disabled={!!classType}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nursery">Nursery</SelectItem>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">Secondary</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="classSection"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="section">Class Section (up to 2 characters)</Label>
                          <FormControl>
                            <Input
                              id="section"
                              placeholder="Enter section (e.g. 'a', 'ab')"
                              maxLength={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Class
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Classes List - Full width */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Created Classes</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search classes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredClasses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <School className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No classes created yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredClasses.map((cls, index) => (
                    <Card key={cls.id || index} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{cls.shortname}</h3>
                              <Badge variant="secondary">{cls.classSection}</Badge>
                              <Badge variant="outline" className="capitalize">
                                {cls.leveltype}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{cls.classname}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(cls)}
                              className="gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onDelete(cls)}
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredClasses.length > 0 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Label>Items per page:</Label>
                    <Select value={limit} onValueChange={handleLimitChange}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LIMIT_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Class Information</DialogTitle>
            <DialogDescription>
              Update the class details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditClass)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="classname"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="edit-className">Class Name</Label>
                      <FormControl>
                        <Input
                          id="edit-className"
                          placeholder="Enter class name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="shortname"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="edit-shortName">Short Name</Label>
                      <FormControl>
                        <Input
                          id="edit-shortName"
                          placeholder="Enter a short name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="leveltype"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="edit-levelType">Level Type</Label>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={!!classType}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nursery">Nursery</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="classSection"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="edit-section">Class Section</Label>
                      <FormControl>
                        <Input
                          id="edit-section"
                          placeholder="Enter section (e.g. 'a', 'ab')"
                          maxLength={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditDialogOpen(false)
                      setSelectedClass(null)
                      resetEditForm({
                        edited: false,
                        classname: '',
                        shortname: '',
                        leveltype: classType || 'primary',
                        classSection: '',
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class <strong>{selectedClass?.classname}</strong>. 
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedClass(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ConfigurationForm