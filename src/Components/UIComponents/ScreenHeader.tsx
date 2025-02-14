import classes from "./uicomponents.module.css";
import { ScreenHeaderTypes } from "../../@Types/CommonComponentTypes";
import CommonButton from "../Buttons/CommonButton";
import { Images } from "../../Shared/ImageExport";
import CommonTooltip from "./CommonTooltip";

export default function ScreenHeader({
  name,
  OnClickAdd,
  OnClickFilter,
  onClickBackBtn,
  onClickSaveBtn,
  onClickDownLoadBtn,
  onClickCopyPermission,
  permissionData,
}: ScreenHeaderTypes) {
  return (
    <div className={classes.container}>
      <h3 className={classes.Header}>{name}</h3>
      <div className={classes.ActionContainer}>
        {OnClickFilter && (
          <img
            src={Images.FILTER_ICON}
            className={classes.FilterIcon}
            alt="filter icon"
            onClick={OnClickFilter}
          />
        )}
        {permissionData?.["invoice_download"] && onClickDownLoadBtn ? (
          <CommonButton
            lable={
              <CommonTooltip title="Download Pdf">
                <img
                  className={classes.exportIcon}
                  src={Images.ExportIcon}
                  alt="Download Icon"
                />
              </CommonTooltip>
            }
            handleClickEvent={() => onClickDownLoadBtn?.()}
            type="export"
          />
        ) : (
          ""
        )}
        {onClickCopyPermission && (
          <CommonButton
            handleClickEvent={() => onClickCopyPermission?.()}
            lable={"Copy Permission"}
            type="edit"
          />
        )}
        {onClickBackBtn && (
          <CommonButton
            handleClickEvent={() => onClickBackBtn?.()}
            lable={"Back"}
            type="reset"
          />
        )}
        {permissionData?.["add"] && OnClickAdd ? (
          <CommonButton
            handleClickEvent={() => OnClickAdd?.()}
            lable={"Create"}
            type="add"
          />
        ) : (
          ""
        )}

        {onClickSaveBtn && (
          <CommonButton
            handleClickEvent={() => onClickSaveBtn?.()}
            lable={"Save"}
            type="modalOk"
          />
        )}
      </div>
    </div>
  );
}
