import { useState } from "react";
import { InputBoxTypes } from "../../@Types/CommonComponentTypes";
import classes from "./Formfields.module.css";
import { Images } from "../../Shared/ImageExport";
import {
  Float_Validation,
  FloatValidation,
  NameValidation,
  numberValidation,
  removeEmojis,
  SEOValidation,
  SpecialCharremoveValidation,
  ValidateAlphanumeric,
} from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
export default function CommonInput({
  lable,
  value,
  placeholder,
  maxLength,
  isRequired,
  errorText,
  isPassword = false,
  handleSubmit,
  onChange,
  onKeyDown,
  inputtype,
  disabled,
  styles,
  validationType,
  onBlur,
  acceptZero = false,
}: InputBoxTypes) {
  const [type, setType] = useState(isPassword ? "password" : "text");

  const handleValidateOnChange = (data: string) => {
    if (validationType === "CHAR_AND_SPACE") {
      return NameValidation(data) && onChange?.(data);
    } else if (validationType === "AMOUNT") {
      if (Float_Validation(data)) {
        if (acceptZero) {
          if (
            // @ts-ignore
            data <= 9999999.99 ||
            data === ""
          ) {
            onChange?.(data);
          }
        } else if (
          // @ts-ignore
          (data <= 9999999.99 && data !== "0") ||
          data === ""
        ) {
          onChange?.(data);
        }
      }
    } else if (validationType === "NUMBER") {
      return numberValidation(data) ? onChange?.(data) : "";
    } else if (validationType === "PREVENT_SPECIAL_CHAR") {
      return SpecialCharremoveValidation(data) && onChange?.(data);
    } else if (validationType === "PREVENT_EMOJI") {
      onChange?.(removeEmojis(data));
    } else if (validationType === "ALPHA_NUMERIC") {
      if (ValidateAlphanumeric(data)) {
        return onChange?.(data);
      }
    } else if (validationType === "SEO_URL") {
      return SEOValidation(data) && onChange?.(data);
    } else if (validationType === "PREVENT_SPACE") {
      return onChange?.(data.trim());
    } else if (validationType === "FLOAT") {
      return FloatValidation(data) && onChange?.(data);
    } else {
      return onChange?.(data);
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
      <div className={classes.fieldContainer}>
        <input
          autoComplete="off"
          type={inputtype ?? type}
          className={`${classes.InputBox} ${
            !GetToken() ? classes.authStyle : classes.mainStyle
          }`}
          value={value}
          placeholder={placeholder}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleValidateOnChange(event.target.value);
          }}
          disabled={disabled}
          maxLength={maxLength}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.which === 13) {
              handleSubmit?.();
            }
          }}
          style={{
            ...styles,
            width: inputtype === "color" ? "100px" : "",
            border: errorText ? "var(--BORDER_ERROR)" : "",
          }}
        />
        {isPassword && (
          <img
            alt="password icon"
            onClick={() => {
              setType((pre) => (pre === "text" ? "password" : "text"));
            }}
            src={type === "text" ? Images.EYE_OPEN : Images.EYE_CLOSE}
          />
        )}
        {inputtype === "color" && value ? (
          <p
            className={classes.colorInput}
            style={{ color: "var(--COLOR_THEME_BLACK)", marginLeft: "10px" }}
          >
            {value}
          </p>
        ) : (
          ""
        )}
      </div>

      {errorText ? <p className={classes.ErroText}>{errorText}</p> : ""}
    </div>
  );
}
