import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ReservationCalenderProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

export default function ReservationCalender({
  value,
  onChange,
}: ReservationCalenderProps) {
  const selectedDate = value || new Date();

  const minTime = new Date(selectedDate);
  minTime.setHours(9, 0, 0, 0);

  const maxTime = new Date(selectedDate);
  maxTime.setHours(18, 0, 0, 0);

  return (
    <DatePicker
      selected={value}
      onChange={(date: Date | null) => {
        if (date) onChange(date);
      }}
      showTimeSelect
      timeIntervals={30}
      dateFormat="yyyy-MM-dd HH:mm"
      minDate={new Date()}
      minTime={minTime}
      maxTime={maxTime}
      className="h-10 w-[400px] border border-main rounded-lg px-2 py-1 z-999"
    />
  );
}
