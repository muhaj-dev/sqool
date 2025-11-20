"use client";

import { useSetting } from "@/contexts/setting-context";

import { Separator } from "../ui/separator";
const tabs = ["Personal Details", "Company Setting", "Password", "Compulsory", "Approval rule"];
const SettingSteps = () => {
  const { activeIndex, updateIndex } = useSetting();
  return (
    <div className="mb-4 overflow-auto">
      <section className="text-sm text-[1rem] flex items-center gap-3 justify-between w-[550px]">
        {tabs.map((item, ind) => (
          <p
            onClick={() => updateIndex(ind)}
            key={ind}
            className={`cursor-pointer transition  ${
              activeIndex === ind
                ? "border-b-[2px] border-primary text-black"
                : "text-muted-foreground"
            }`}
          >
            {item}
          </p>
        ))}
      </section>
      <Separator />
    </div>
  );
};

export default SettingSteps;
