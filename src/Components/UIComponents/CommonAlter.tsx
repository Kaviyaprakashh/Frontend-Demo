import { Alert } from "antd";
import { AlterProps } from "../../@Types/CommonComponentTypes";

export default function CommonAlter({
  msg,
  type,
  showIcon = true,
  style,
}: AlterProps) {
  return (
    <Alert message={msg} type={type} showIcon={showIcon} style={{ ...style }} />
  );
}
