"use client";

import React, { useState } from "react";

import Staffbar from "./components/parent/Staffbar";
import ParentProfile from "./components/parent/ParentProfile";
import Noticeboard from "./components/parent/Noticeboard";
import ParentExp from "./components/parent/ParentExp";
import PaymentTable from "./components/payment/PaymentTable";
import PaymentBar from "./components/payment/PaymentBar";
import ParentDashboard from "./components/ParentDashboard";

const Page = () => {
  return (
    <div>
      {/* <PaymentBar /> */}
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        {/* <PaymentTable /> */}
        <ParentDashboard />
      </div>
    </div>
  );
};

export default Page;
