import { Switch } from "antd";
import { CommonSwitchProps } from "../../@Types/CommonComponentTypes";

export default function CommonSwitchbutton({
  checked,
  onChange,
  disabled = false,
}: CommonSwitchProps) {
  return (
    <Switch
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
