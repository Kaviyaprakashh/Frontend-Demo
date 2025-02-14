import { InputBoxTypes } from "../../@Types/CommonComponentTypes";
import { GetToken } from "../../Shared/StoreData";
import classes from "./Formfields.module.css";

export default function CommonTextArea({
  lable,
  value,
  placeholder,
  maxLength,
  isRequired,
  errorText,
  onChange,
  onKeyDown,
  disabled,
}: InputBoxTypes) {
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
      <div className={`autoScroll ${classes.fieldContainer}`}>
        <textarea
          className={` ${classes.InputBox} ${
            !GetToken() ? classes.authStyle : classes.mainStyle
          }`}
          value={value}
          placeholder={placeholder}
          onChange={(event: any) => onChange?.(event.target.value)}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
          disabled={disabled}
          style={{
            height: "100px",
            padding: "10px",
            border: errorText ? "var(--BORDER_ERROR)" : "",
          }}
        />
      </div>
      {errorText ? <p className={classes.ErroText}>{errorText}</p> : ""}
    </div>
  );
}
