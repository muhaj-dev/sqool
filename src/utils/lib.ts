// utils/dateUtils.ts
export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'No date available'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const calculateAge = (dateString: string | Date | undefined): number | string => {
  if (!dateString) return 'N/A'

  const birthDate = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
