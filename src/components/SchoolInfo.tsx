import React from 'react'
import SchoolInfoForm from './SchoolInfoForm'

const SchoolInfo = () => {
  return (
    <div className="py-4 ">
      <div>
        <h3>Tell us about your School</h3>
        <p className="text-muted-foreground">This is School information that you can update anytime.</p>
      </div>
      <div>
        <SchoolInfoForm />
      </div>
    </div>
  )
}

export default SchoolInfo
