import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Weekcalendar = () => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="twoWeek"
      views={{
        twoWeek: {
          type: "dayGrid",
          duration: { weeks: 2 }, // 2주만 표시
          buttonText: "2 Weeks",
        },
      }}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "twoWeek",
      }}
      height="400px" // 높이 조절 가능
    />
  );
};

export default Weekcalendar;
