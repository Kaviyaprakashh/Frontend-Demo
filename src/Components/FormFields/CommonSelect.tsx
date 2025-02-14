import { SelectBoxTypes } from "../../@Types/CommonComponentTypes";
import { OptionTypes } from "../../@Types/GlobalTypes";
import { GetToken } from "../../Shared/StoreData";
import classes from "./Formfields.module.css";
import { ConfigProvider, Select } from "antd";
export default function CommonSelect({
  lable,
  value,
  placeholder,
  isRequired,
  errorText,
  options,
  onChange,
  mode,
  allowClear = false,
  disabled = false,
  optionFilterProp,
  styles,
  onKeyDown,
  onClick,
  optionName,
}: SelectBoxTypes) {
  const getValue = () => {
    if (mode === "multiple") {
      return optionName;
    }
    let findValue = options?.find((ele: OptionTypes) => ele?.value === value);
    return findValue ? value : optionName;
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            optionSelectedBg:
              mode === "multiple" ? "transparant" : "var(--TABLE_HEADER_COLOR)",
            optionSelectedColor: mode === "multiple" ? "#000" : "#fff",

            /* here is your component tokens */
          },
        },
        token: {
          /* here is your global tokens */
        },
      }}
    >
      <div className={classes.container}>
        {lable ? (
          <p className={classes.Label}>
            {lable}
            {isRequired ? <span className={classes.requiredIcon}>*</span> : ""}
          </p>
        ) : (
          ""
        )}
        <Select
          status={errorText ? "error" : ""}
          mode={mode}
          allowClear={allowClear}
          showSearch={true}
          options={options}
          dropdownStyle={{ zIndex: 11000 }}
          placeholder={placeholder}
          value={optionName ? getValue() : value}
          onChange={(data: any, option: any) => {
            if (mode === "multiple") {
              let finaldata = data?.map((ele: any) => {
                let optionsData = options?.find(
                  (elem: any) => elem?.value === ele
                );
                let optionNameData = optionName?.find(
                  (elem: any) => elem?.value === ele
                );

                if (optionsData) {
                  return optionsData;
                } else {
                  return optionNameData;
                }
              });
              onChange?.(data, finaldata);
            } else {
              onChange?.(data, option);
            }
          }}
          notFoundContent={`No ${lable ?? "Data"} Found`}
          onClick={onClick}
          disabled={disabled}
          optionFilterProp={optionFilterProp || "label"}
          filterOption={(input, option: any) =>
            (option[optionFilterProp || "label"] ?? "")
              .toLocaleLowerCase()
              .includes(input.toLocaleLowerCase())
          }
          // prefix={}
          aria-autocomplete="none"
          style={{
            ...styles,
            padding: "0px",
            border: errorText ? "var(--BORDER_ERROR)" : "",
          }}
          onKeyDown={onKeyDown}
          className={`${classes.InputBox} ${
            !GetToken() ? classes.authStyle : classes.mainStyle
          } ${mode === "multiple" ? "autoScroll" : ""}`}
        />
        {errorText ? <p className={classes.ErroText}>{errorText}</p> : ""}
      </div>
    </ConfigProvider>
  );
}
