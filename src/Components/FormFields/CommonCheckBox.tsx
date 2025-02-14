import { Checkbox } from "antd";
import { CheckBoxTypes } from "../../@Types/CommonComponentTypes";

export default function CommonCheckBox({
  checked,
  onChange,
  disabled = false,
}: CheckBoxTypes) {
  return (
    <Checkbox
      disabled={disabled}
      checked={checked}
      className={"Checkbox"}
      onClick={onChange}
    />
  );
}
