import { CheckCircle2, Video } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Sidebar = () => {
  return (
    <div className="border-r-2 h-screen pl-3 pt-3 bg-white">
      <div className="flex flex-col justify-between h-[70%] pr-6 ">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-3xl text-primary font-bold">SQOOLIFY</h2>
          <div className="flex items-center bg-white py-2 px-6 rounded-md shadow-sm gap-2 w-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            John Doe
          </div>
          <div className="flex mt-4 flex-col gap-6">
            <h2 className="text-[18px]">Tip to upload Document</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <CheckCircle2 className="text-[#2EB57E]    rounded-full" />
              <span> use Clear not blurry image</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <CheckCircle2 className="text-[#2EB57E] w-8" />
              <span>make Show your ID number is visible</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <CheckCircle2 className="text-[#2EB57E]    rounded-full w-8" />
              <span>make Show you Upload Correct Images</span>
            </div>
            <div className="flex items-center gap-4 text-sm bg-white p-2 rounded">
              <Video className="text-primary    rounded-full " />
              <span className="text-primary">Watch how to fill the form</span>
            </div>
          </div>
        </div>
        <div className="bg-white w-full p-4 flex flex-col gap-2">
          <p>Nees Help?</p>
          <p className="text-primary text-sm">Call us on 070122344654</p>
          <p className="text-primary text-sm">Send Us Email</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
