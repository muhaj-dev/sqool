import React from 'react'
import LibraryList from '../../components/class/library/LibraryList'
import Librarybar from '../../components/class/library/Librarybar'

const page = () => {
  return (
    <div>
      <Librarybar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        <LibraryList />
      </div>
    </div>
  )
}

export default page
