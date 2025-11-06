// src/app/admin/parent/ParentList.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import AdminTable from '@/components/Constant/Table/AdminTable'
import { useRouter } from 'next/navigation'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '../ui/button';
import Link from 'next/link'
import { IParent, ParentPaginationResponse, IStudent } from '@/types'
import { getAllParents } from '@/utils/api'

interface ITableData {
  _id: string
  photo: string
  firstName: string
  lastName: string
  parent?: {
    _id: string
    userId: {
      firstName: string
      lastName: string
    }
    isActive: boolean
  }
  occupation?: string
  class?: any
  gender?: any
  hobbies?: any[]
}

const ParentList = () => {
  const [parents, setParents] = useState<IParent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [pagination, setPagination] = useState<ParentPaginationResponse['data']['pagination']>({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null,
    previousPage: null,
  })
  const router = useRouter()

  const fetchParents = async (page: number = 1, limit: number = 10, searchQuery?: string, filter?: string) => {
    try {
      setLoading(true)
      console.log('Fetching parents with params:', { page, limit, searchQuery, filter })
      const response = await getAllParents(page, limit, searchQuery, filter)
      setParents(response.data.result)
      console.log('Parents fetched:', response.data.result)
      setPagination(response.data.pagination)
    } catch (err) {
      console.error('Error fetching parents:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch parents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParents(pagination.currentPage, pagination.pageSize, search, statusFilter)
  }, [search, statusFilter])

  const handlePageChange = (newPage: number) => {
    fetchParents(newPage, pagination.pageSize, search, statusFilter)
  }

  // const handleNextPage = () => {
  //   if (pagination.currentPage < pagination.totalPages && pagination.hasNextPage) {
  //     handlePageChange(pagination.currentPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (pagination.currentPage > 1 && pagination.hasPreviousPage) {
  //     handlePageChange(pagination.currentPage - 1);
  //   }
  // };

  // Transform IParent data into IStudent-compatible data
  const filteredParents = (): ITableData[] => {
    return parents.map(parent => ({
      _id: parent._id,
      photo: '/images/user.png', // Default photo for parents
      firstName: parent?.user?.firstName,
      lastName: parent?.user?.lastName,
      parent: {
        _id: parent._id,
        userId: {
          firstName: parent?.user?.firstName,
          lastName: parent?.user?.lastName,
        },
        isActive: parent?.isActive,
      },
      class: {
        _id: '', // Placeholder; IParent doesn't have class info
        className: 'N/A',
      },
      gender: undefined, // IParent doesn't have gender
      hobbies: [], // IParent doesn't have hobbies
    }))
  }

  const RenderParentName = ({ item }: { item: IStudent }) => {
    return (
      <div className="flex gap-4 items-center">
        {/* <Avatar className="h-12 w-12">
          <AvatarImage src={item.photo} />
          <AvatarFallback>{`${item.firstName}${item.lastName}`}</AvatarFallback>
        </Avatar> */}
        <p className="text-[16px] font-medium text-[#3F4946]">{`${item.firstName} ${item.lastName}`}</p>
      </div>
    )
  }

  const RenderOccupation = ({ item }: { item: IStudent }) => {
    // Conditionally look up the original IParent for occupation
    const originalParent = parents.find(p => p._id === item._id)
    return <p className="text-[14px] text-[#3F4946] font-medium">{originalParent?.occupation || 'N/A'}</p>
  }

  const RenderAction = ({ item }: { item: IStudent }) => {
    // Conditionally look up the original IParent for _id
    const originalParent = parents.find(p => p._id === item._id)
    const handleViewDetails = () => {
      if (originalParent) {
        router.push(`/admin/parent/${originalParent._id}`)
      }
    }

    return (
      <div>
        <button
          onClick={handleViewDetails}
          className="text-[14px] border-[#E9EBEB] border-[1px] text-primary font-medium py-[10px] px-[16px]"
        >
          View Details
        </button>
      </div>
    )
  }

  const columns = [
    {
      key: 'name',
      label: 'Parent name',
      renderCell: (item: IStudent) => <RenderParentName item={item} />,
    },
    {
      key: 'occupation',
      label: 'Occupation',
      renderCell: (item: IStudent) => <RenderOccupation item={item} />,
    },
    {
      key: 'action',
      label: 'Action',
      renderCell: (item: IStudent) => <RenderAction item={item} />,
    },
  ]

  const sortOptions = [
    { label: 'Newest First', value: 'desc' },
    { label: 'Oldest First', value: 'asc' },
  ]

  const statusOptions = [{ label: 'All', value: '' }]

  if (loading) {
    return <div>Loading parents...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 flex-row my-4">
        <div className="w-full md:w-[50%]">
          <h3 className="text-xl font-bold">Parents</h3>
          <p className="text-muted-foreground w-full max-w-[490px] text-sm">
            Showing {filteredParents().length} of {pagination.total} parents
          </p>
        </div>
        {/* <section className="w-fit ml-auto mb-2">
          <Link
            href="/admin/parent/add"
            className="flex items-center text-white text-sm rounded-md bg-primary cursor-pointer hover:bg-white hover:text-primary border-[1px] border-primary py-2 px-6 transition-all"
          >
            Add New Parent
          </Link>
        </section> */}
      </div>
      <Separator />
      <div className="bg-white p-0 md:p-4 rounded-md">
        <AdminTable
          title="Parents"
          columns={columns}
          data={filteredParents()}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pagination={pagination}
          showItemCheck={true}
          onPageChange={handlePageChange}
          sortOptions={sortOptions}
          statusOptions={statusOptions}
          onSort={sortValue => {
            console.log('Sort by:', sortValue)
          }}
          onStatusFilterChange={status => {
            console.log('Filter by:', status)
            setStatusFilter(status)
          }}
          onRecordClicked={student => {
            console.log('Student clicked (transformed parent):', student)
          }}
        />
      </div>
    </section>
  )
}

export default ParentList
