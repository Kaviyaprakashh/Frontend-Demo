import classes from "../Modal.module.css";

import { viewModalProps } from "../../@Types/ModalProps";
import dayjs from "dayjs";
import CommonButton from "../../Components/Buttons/CommonButton";
import GlobalTable from "../../Components/UIComponents/GlobalTable";
import { TableOptionsType } from "../../@Types/CommonComponentTypes";
import { ConvertDatetime } from "../../Shared/Methods";

export default function ViewTaxModal({
  OnClose,
  UpdateData,
  title,
}: viewModalProps) {
  const TableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Tax",
      key: "tax_type",
      className: "contant1_width",
      render: (text: any, _, index) => index + 1,
    },
  ];
  return (
    <div className={classes.viewModalContainer}>
      <h3>{title}</h3>
      <div className={classes.viewMainBlock}>
        <p>
          <span>Title</span>:<span>{UpdateData.title || "-"}</span>
        </p>
        <p>
          <span>Description</span>:<span>{UpdateData.description || "-"}</span>
        </p>
        <p>
          <span>Created At</span>:
          <span>
            {UpdateData.created_at
              ? ConvertDatetime(UpdateData.created_at, "DATE_TIME")
              : "-" || "-"}
          </span>
        </p>
        <p>
          <span>Updated At</span>:
          <span>
            {UpdateData.updated_at
              ? ConvertDatetime(UpdateData.updated_at, "DATE_TIME")
              : "-" || "-"}
          </span>
        </p>
      </div>
      <div className={classes.viewModalContainer}>
        <GlobalTable
          total={3}
          Options={TableOptions}
          items={UpdateData.tax_rate}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CommonButton
          lable="Close"
          handleClickEvent={OnClose}
          styles={{ alignContent: "end" }}
        />
      </div>
    </div>
  );
}
