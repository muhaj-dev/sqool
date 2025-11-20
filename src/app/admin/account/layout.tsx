"use client";
import { Dialog } from "@radix-ui/react-dialog";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full mx-auto ">
      <Dialog>
        <main className="">
          {/* <AccountTopbar /> */}
          <div>{children}</div>
        </main>
      </Dialog>
    </section>
  );
}
