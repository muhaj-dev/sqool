import CalendarWithCheckboxes from "../../components/parent/schedule/CalendarWithCheckboxes";
import SchedulBar from "../../components/parent/schedule/SchedulBar";
import ScheduleCalendar from "../../components/parent/schedule/ScheduleCalender";

const Page = () => {
  return (
    <div>
      <SchedulBar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        <ScheduleCalendar />
        <CalendarWithCheckboxes />
      </div>
    </div>
  );
};

export default Page;
