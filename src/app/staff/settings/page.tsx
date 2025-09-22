'use client'

import React, { useState } from 'react';
import Settingsbar from '../components/settings/settingsbar';
import SettingsDetails from '../components/settings/SettingsDetails';

const Page = () => {

  return (
    <div>
      <Settingsbar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
          <SettingsDetails />
      </div>
    </div>
  );
};

export default Page;
