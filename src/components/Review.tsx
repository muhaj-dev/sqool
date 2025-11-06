import React from 'react'
import OwnerInfoForm from './OwnerInfoForm'
import { Check, Trash2 } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'

const Ownerinfo = () => {
  const requirments = [
    {
      label: 'Company Information',
      text: 'Personal information of the business Owner(s)',
    },
    {
      label: 'Owner Information',
      text: 'Personal information of the business Owner(s)',
    },
    {
      label: 'Business Documentation',
      text: 'Personal information of the business Owner(s)',
    },
    {
      label: 'Setup School',
      text: 'Personal information of the business Owner(s)',
    },
  ]
  return (
    <div className="py-4 ">
      <div>
        <h3>Review your Application</h3>
        <p className="text-muted-foreground">
          This is the final look at your application. Make sure you met all the registration requirement.
        </p>
      </div>
      <div className="bg-white rounded-md p-4 mt-8    ">
        <div className="flex flex-col gap-4">
          {requirments.map(item => (
            <div key={item.label} className="flex gap-8 items-center w-full p-4 rounded-sm border">
              <div className=" rounded-full p-4 bg-[#f6513b48]">
                <Trash2 className="text-red-600" />
              </div>
              {/* <div className=" rounded-full p-4 bg-[#1AD48E]">
                <Check className="text-white" />
              </div> */}
              <div className="flex flex-col">
                <h3 className="text-[18px]">{item.label}</h3>
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            </div>
          ))}
          <div className="items-top flex space-x-2 mt-8">
            <Checkbox
              id="terms1"
              className=" border-muted-foreground  
            data-[state=checked]:bg-transparent data-[state=checked]:text-primary
            "
            />
            <div className="grid gap-1.5 leading-none">
              <p className="text-sm text-muted-foreground">I Confirm tis information provide Are Accurate and legit.</p>
            </div>
          </div>
          <div className="w-full">
            <div className="mx-auto w-[40%] mt-6">
              <Button className="text-white w-full">Submit Application</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ownerinfo
