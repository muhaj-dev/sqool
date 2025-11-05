'use client'

import { useState } from 'react'
import { AxiosError } from 'axios'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import log from '@/lib/logger/clientLogger'

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount: number, error: unknown) => {
              const axiosError = error as AxiosError
              if (axiosError.response?.status === 404) return false
              return failureCount < 2
            },
          },
          mutations: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message?: string }>
            const errorMessage =
              axiosError.response?.data?.message || 'An unknown error occurred'
            log.error(errorMessage)
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message?: string }>
            const errorMessage =
              axiosError.response?.data?.message || 'Mutation failed'
            log.error(errorMessage)
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
