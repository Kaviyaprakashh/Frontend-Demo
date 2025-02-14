import { Tooltip } from "antd";
import React from "react";

export default function CommonTooltip({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return <Tooltip title={title}>{children}</Tooltip>;
}
