import AddStudentForm from './Components/AddStudentForm'

const Page = () => {
  return (
    <div className="p-6">
      <div>
        <div className="w-full flex justify-between items-center">
          <p className="text-[32px] font-medium">Add New Student</p>
        </div>
      </div>
      <AddStudentForm />
    </div>
  )
}

export default Page
