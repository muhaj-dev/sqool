import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import OTPInput from '@/components/OTPInput'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const VerifyPhoneNumber = () => {
  return (
    <MaxWidthWrapper>
      <div>
        <span className="text-primary font-bold  sm:text-2xl">SQOOLIFY</span>
      </div>
      <Wrapper className="h-screen sm:w-[60%] w-full  mx-auto gap-4">
        <div className="text-center">
          <h2 className="text-primary text-xl mb-3">Verify your Phone number</h2>
          <p className="text-[#515B6F]">We sent an OTP to 0812xxxx345 by SMS and WhatsApp.</p>
        </div>
        <div className="my-8">
          <p>Enter OTP Code</p>
          <OTPInput />
        </div>

        <Button className="text-white font-semibold bg-primary  w-full mb-4">Verify</Button>
        <p className="text-left w-full">
          Didn’t get the code?{' '}
          <Link href={'#'} className="text-primary font-semibold">
            Click Resend
          </Link>
        </p>
        <div className="bg-[rgba(55,114,255,0.10)] text-primary p-3 my-6">
          Still not recevie your OTP kindly cross check you phone number by
          <Link href={'/'} className="font-semibold px-1    ">
            Click here
          </Link>
        </div>
      </Wrapper>
      <p className="text-[#8C8C8C] text-sm text-center">Terms of service. Having problem with login?</p>
    </MaxWidthWrapper>
  )
}

export default VerifyPhoneNumber
