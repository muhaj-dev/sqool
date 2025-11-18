import StaffList from "@/components/staff/StaffList";
import StaffContextProvider from "@/contexts/staff-context";

const page = () => {
  return (
    <div>
      <StaffContextProvider>
        <StaffList />
      </StaffContextProvider>
    </div>
  );
};

export default page;
