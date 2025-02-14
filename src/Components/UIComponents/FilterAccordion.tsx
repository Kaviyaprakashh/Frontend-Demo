import { Collapse, CollapseProps } from "antd";
import React from "react";
type filterProps = {
  showFilter: boolean;
  children: React.ReactNode;
};

export default function FiltersAccordion({
  showFilter,
  children,
}: filterProps) {
  const onChange = (key: string | string[]) => {};
  const items: CollapseProps["items"] = [
    {
      key: "1",
      children: children,
      showArrow: false,
    },
  ];

  return (
    <Collapse
      className="filterAccourdian"
      accordion={true}
      activeKey={showFilter ? ["1"] : []}
      onChange={onChange}
      items={items}
      ghost
    />
  );
}
