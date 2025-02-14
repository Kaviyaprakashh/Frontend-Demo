import { Popover } from "antd";

import { PopoverProps } from "../../@Types/ComponentProps";
import classes from "./uicomponents.module.css";
export default function CommonPopover({
  content,
  children,
  title,
}: PopoverProps) {
  return (
    <Popover
      title={title || ""}
      content={<p className={classes.contentBox}>{content || ""}</p>}
      placement="topLeft"
    >
      {children}
    </Popover>
  );
}
