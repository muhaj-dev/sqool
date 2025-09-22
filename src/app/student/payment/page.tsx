'use client'

import React, { useState } from 'react';
import Paymentbar from '../components/Paymentbar';
import PaymentFee from '../components/PaymentFee';

const Page = () => {
  const [showTexam, setShowTexam] = useState<boolean>(false);

  return (
    <div>
      <Paymentbar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-3 px-0 md:px-5">
          <PaymentFee  />
      </div>
    </div>
  );
};

export default Page;
