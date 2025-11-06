import React from 'react'

const AccountCard = () => {
  return (
    <div className="flex items-center gap-2 bg-white p-1 md:p-4 text-sm md:text-[1rem] rounded-md w-full h-fit">
      <div className="h-16 w-16 rounded-full bg-[#cfcfcfa6]"></div>
      <div>
        <p>Total school payment </p>
        <p className="text-xl font-semibold">N 450,666,66</p>
      </div>
    </div>
  )
}

export default AccountCard
