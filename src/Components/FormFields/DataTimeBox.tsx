import { DatePicker } from "antd";
import classes from "./Formfields.module.css";
import dayjs from "dayjs";
import { DatePickerProps } from "../../@Types/CommonComponentTypes";

export default function CommonDatetimePicker({
  lable,
  value,
  placeholder,
  isRequired,
  errorText,
  onChange,
  allowClear = false,
  disabled,
  picker = undefined,
  formate,
  dateFormat,
  styles,
  isFuture,
  fromtodate,
  isPast,
  startDate,
  endDate,
  onKeyDown,
}: DatePickerProps) {
  // Disable dates
  const disableFutureDt = (date: any) => {
    if (isFuture) {
      return date.isAfter(new Date());
    } else if (isPast) {
      return date.isBefore(dayjs().startOf("day"));
    } else if (fromtodate) {
      let startCheck = true;
      let endCheck = true;
      if (startDate) {
        startCheck =
          (date && date < dayjs(startDate, "YYYY-MM-DD")) ||
          date > dayjs(new Date());
      }
      if (endDate) {
        endCheck = date && date > dayjs(endDate, "YYYY-MM-DD");
      }
      return (startCheck && startDate) || (endCheck && endDate);
    }
  };
  return (
    <div className={classes.container}>
      {lable ? (
        <p className={classes.Label}>
          {lable}
          {isRequired ? <span className={classes.requiredIcon}>*</span> : ""}
        </p>
      ) : (
        ""
      )}
      <DatePicker
        status={errorText ? "error" : ""}
        allowClear={allowClear}
        format={formate}
        popupStyle={{ zIndex: 11000 }}
        placeholder={placeholder}
        value={value ? dayjs(value) : null}
        onChange={(date) => {
          onChange?.(date ? dayjs(date).format(dateFormat) : "");
        }}
        disabled={disabled}
        style={{
          ...styles,
          background: disabled ? "rgb(216 216 216 / 44%)" : "#fff",
        }}
        className={classes.InputBox}
        disabledDate={(date) =>
          isFuture || isPast || fromtodate ? disableFutureDt(date) : null
        }
        picker={picker}
        showToday={false}
        onKeyDown={onKeyDown}
      />

      {errorText ? <p className={classes.ErroText}>{errorText}</p> : ""}
    </div>
  );
}
