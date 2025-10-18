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
