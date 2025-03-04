import "react-datepicker/dist/react-datepicker.css";
interface ReservationCalenderProps {
    value: Date | null;
    onChange: (date: Date) => void;
}
export default function ReservationCalender({ value, onChange, }: ReservationCalenderProps): import("react/jsx-runtime").JSX.Element;
export {};
