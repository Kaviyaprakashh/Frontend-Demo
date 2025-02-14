import classes from "../Modal.module.css";
import { viewModalProps } from "../../@Types/ModalProps";
import { ConvertDatetime } from "../../Shared/Methods";
import { GetstatusWithColor } from "../../Shared/Components";

export default function ViewAttributeGroups({
  UpdateData,
  title,
}: viewModalProps) {
  return (
    <div className={classes.viewModalContainer}>
      <h3>{title ?? UpdateData.name}</h3>
      <div className={classes.viewMainBlock}>
        <p>
          <span>Title</span>:<span>{UpdateData.title || "-"}</span>
        </p>

        <p>
          <span>Sort Order</span>:
          <span>
            {UpdateData?.sort_order >= 0 ? UpdateData?.sort_order : "-"}
          </span>
        </p>
        <p>
          <span>Status</span>:{GetstatusWithColor(UpdateData.status)}
        </p>
        <p>
          <span>Created At</span>:
          <span>
            {UpdateData.created_at
              ? ConvertDatetime(UpdateData.created_at, "DATE_TIME")
              : "-"}
          </span>
        </p>
        {/* <div>
          <span> Attributes</span>
          {UpdateData?.attribute?.length > 0 ? (
            <GlobalTable
              Options={TableOptions}
              items={UpdateData?.attribute}
              total={UpdateData?.attribute?.length}
              ismodify={true}
            />
          ) : (
            <Nodata msg="No Attributes Found" />
          )}
        </div> */}
      </div>
    </div>
  );
}
