import { Dropdown } from "antd";
import React from "react";
import classes from "./Formfields.module.css";

export default function Commondropdown({
  children,
  items,
}: {
  children: React.ReactNode;
  items: any;
}) {
  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      overlayStyle={{ cursor: "pointer" }}
      className={classes.itemstyle}
    >
      {children}
    </Dropdown>
  );
}
