"use client";

import Settingsbar from "@/app/staff/components/settings/settingsbar";
import SettingsDetails from "@/app/staff/components/settings/SettingsDetails";

const Page = () => {
  return (
    <div>
      <Settingsbar />
      <div className="w-full mt-8 bg-white py-5 px-0 md:px-9">
        <SettingsDetails />
      </div>
    </div>
  );
};

export default Page;
