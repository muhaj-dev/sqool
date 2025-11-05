// app/student/[studentId]/error.jsx
'use client'

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>Error: {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
