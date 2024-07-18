import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { OrderModel } from "../../../../../Models/OrderModel";

export function ExpirationDatePicker(): JSX.Element {
  const { setValue } = useFormContext<OrderModel>();

  const handleExpirationDateChange = (newValue: Date | null) => {
    setDate(newValue);
    const month = newValue.getMonth() + 1;
    const year = newValue.getFullYear();
    const formattedDate = `${month.toString().padStart(2, "0")}/${year
      .toString()
      .slice(-2)}`;
    setValue("customer.paymentDetails.expirationDate", formattedDate);
  };
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="DatePickerSelect mt-2 flex justify-center">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Expiration date"
          value={date}
          onChange={handleExpirationDateChange}
          className="w-ful"
          inputFormat="MM/yyyy"
          views={["month", "year"]}
          minDate={new Date()}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
}
