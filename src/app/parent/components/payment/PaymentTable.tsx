import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

import { paymentData } from "@/components/student/student-data";

import { AddPaymentCard } from "./AddPaymentCard";
import { PaymentCol } from "./PaymentCol";
import { PaymentTableRow } from "./PaymentTableRow";

const PaymentTable = () => {
  return (
    <section className="flex flex-col gap-4">
      <div className="bg-white p-0 md:p-2 lg:p-4 rounded-md">
        <section className="w-fit ml-auto mb-2">
          <Dialog>
            <DialogTrigger className="flex items-center text-white tex-sm rounded-md bg-primary cursor-pointer py-2 px-6">
              {/* <Plus /> */}
              <span>Make payment</span>
            </DialogTrigger>

            <AddPaymentCard />
          </Dialog>
        </section>
        <div className="px-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-0 md:my-4">
          <div className=" w-full flex gap-2 items-center">
            <div className="bg-[#F3E5F5] px-3 py-[18px] flex items-center justify-center rounded-full">
              <TPay />
            </div>
            <div className="space-y-">
              <p className="text-sm">Total school payment</p>
              <p className="font-bold text-[16px]">₦450,666.66</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="bg-[#FFEAEA] px-3 py-[18px] flex items-center justify-center rounded-full">
              <OPay />
            </div>
            <div className="space-y-">
              <p className="text-sm">Outstanding payment</p>
              <p className="font-bold text-[16px]">₦450,666.66</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="bg-[#FFF2D8] px-3 py-[18px] flex items-center justify-center rounded-full">
              <CFee />
            </div>
            <div className="space-y-">
              <p className="text-sm">Current Term School fee</p>
              <p className="font-bold text-[16px]">₦450,666.66</p>
            </div>
          </div>
        </div>
        <PaymentTableRow data={paymentData} columns={PaymentCol} />
      </div>
    </section>
  );
};

export default PaymentTable;

const TPay = () => {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.7891 5.80348L20.4588 1L8.21314 11.0639L7.53429 11.0564V11.0671H7V24H29V11.0671H27.9922L25.987 5.03289L23.7891 5.80348ZM25.7786 11.0671H15.273L23.0977 8.32323L24.6922 7.79837L25.7786 11.0671ZM21.719 6.52987L13.6419 9.36217L20.0387 4.10496L21.719 6.52987ZM9.09524 19.8712V15.1938C9.53722 15.0327 9.93868 14.7721 10.2703 14.4311C10.602 14.0901 10.8555 13.6772 11.0124 13.2226H24.9876C25.1444 13.6774 25.3979 14.0904 25.7295 14.4316C26.0612 14.7728 26.4627 15.0336 26.9048 15.1949V19.8723C26.4627 20.0336 26.0612 20.2943 25.7295 20.6355C25.3979 20.9767 25.1444 21.3898 24.9876 21.8445H11.0145C10.8575 21.3894 10.6038 20.976 10.2717 20.6346C9.9397 20.2932 9.53775 20.0324 9.09524 19.8712Z"
        fill="#B700DD"
      />
    </svg>
  );
};

const OPay = () => {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_859_11792)">
        <path
          d="M14.4 16.8H21.6V15H19.2V6.6H17.0625L14.2875 9.16875L15.7313 10.6688C16.2563 10.2063 16.6 9.85 16.7625 9.6H16.8V15H14.4V16.8ZM24 12C24 12.875 23.8688 13.7625 23.6063 14.6625C23.3438 15.5625 22.9719 16.4 22.4906 17.175C22.0094 17.95 21.375 18.5813 20.5875 19.0688C19.8 19.5563 18.9375 19.8 18 19.8C17.0625 19.8 16.2 19.5563 15.4125 19.0688C14.625 18.5813 13.9906 17.95 13.5094 17.175C13.0281 16.4 12.6562 15.5625 12.3938 14.6625C12.1313 13.7625 12 12.875 12 12C12 11.125 12.1313 10.2375 12.3938 9.3375C12.6562 8.4375 13.0281 7.6 13.5094 6.825C13.9906 6.05 14.625 5.41875 15.4125 4.93125C16.2 4.44375 17.0625 4.2 18 4.2C18.9375 4.2 19.8 4.44375 20.5875 4.93125C21.375 5.41875 22.0094 6.05 22.4906 6.825C22.9719 7.6 23.3438 8.4375 23.6063 9.3375C23.8688 10.2375 24 11.125 24 12ZM33.6 16.8V7.2C32.275 7.2 31.1438 6.73125 30.2063 5.79375C29.2688 4.85625 28.8 3.725 28.8 2.4H7.2C7.2 3.725 6.73125 4.85625 5.79375 5.79375C4.85625 6.73125 3.725 7.2 2.4 7.2V16.8C3.725 16.8 4.85625 17.2688 5.79375 18.2063C6.73125 19.1438 7.2 20.275 7.2 21.6H28.8C28.8 20.275 29.2688 19.1438 30.2063 18.2063C31.1438 17.2688 32.275 16.8 33.6 16.8ZM36 1.2V22.8C36 23.125 35.8813 23.4063 35.6438 23.6438C35.4063 23.8813 35.125 24 34.8 24H1.2C0.875 24 0.59375 23.8813 0.35625 23.6438C0.11875 23.4063 0 23.125 0 22.8V1.2C0 0.875 0.11875 0.59375 0.35625 0.35625C0.59375 0.11875 0.875 0 1.2 0H34.8C35.125 0 35.4063 0.11875 35.6438 0.35625C35.8813 0.59375 36 0.875 36 1.2Z"
          fill="#FF0000"
        />
      </g>
      <defs>
        <clipPath id="clip0_859_11792">
          <rect width="36" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const CFee = () => {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.5 16.5357C22.2613 16.5357 22.0324 16.6317 21.8636 16.8025C21.6948 16.9732 21.6 17.2049 21.6 17.4464C21.6 17.688 21.6948 17.9196 21.8636 18.0904C22.0324 18.2612 22.2613 18.3571 22.5 18.3571H25.5C25.7387 18.3571 25.9676 18.2612 26.1364 18.0904C26.3052 17.9196 26.4 17.688 26.4 17.4464C26.4 17.2049 26.3052 16.9732 26.1364 16.8025C25.9676 16.6317 25.7387 16.5357 25.5 16.5357H22.5ZM6 8.94643C6 7.89977 6.41089 6.89598 7.14228 6.15588C7.87368 5.41578 8.86566 5 9.9 5H26.1C26.6122 5 27.1193 5.10208 27.5925 5.3004C28.0656 5.49873 28.4956 5.78942 28.8577 6.15588C29.2199 6.52234 29.5071 6.95739 29.7031 7.4362C29.8991 7.915 30 8.42818 30 8.94643V18.0536C30 18.5718 29.8991 19.085 29.7031 19.5638C29.5071 20.0426 29.2199 20.4777 28.8577 20.8441C28.4956 21.2106 28.0656 21.5013 27.5925 21.6996C27.1193 21.8979 26.6122 22 26.1 22H9.9C8.86566 22 7.87368 21.5842 7.14228 20.8441C6.41089 20.104 6 19.1002 6 18.0536V8.94643ZM28.2 10.4643V8.94643C28.2 8.38284 27.9788 7.84234 27.5849 7.44383C27.1911 7.04531 26.657 6.82143 26.1 6.82143H9.9C9.34305 6.82143 8.8089 7.04531 8.41508 7.44383C8.02125 7.84234 7.8 8.38284 7.8 8.94643V10.4643H28.2ZM7.8 12.2857V18.0536C7.8 19.2266 8.7408 20.1786 9.9 20.1786H26.1C26.657 20.1786 27.1911 19.9547 27.5849 19.5562C27.9788 19.1577 28.2 18.6172 28.2 18.0536V12.2857H7.8Z"
        fill="#FFA206"
      />
    </svg>
  );
};
