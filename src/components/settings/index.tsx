"use client";

import { useSetting } from "@/contexts/setting-context";

const Settings = () => {
  const { step: Component } = useSetting();

  return <div className="w-full">{<Component />}</div>;
};

export default Settings;
