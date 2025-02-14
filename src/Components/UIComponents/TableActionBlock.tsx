import { tableActionProps } from "../../@Types/ComponentProps";
import { Images } from "../../Shared/ImageExport";
import classes from "./uicomponents.module.css";
import CommonImageBox from "../FormFields/CommonImageBox";
import { CheckAllvalues, getUserData } from "../../Shared/Methods";

export default function TableActionBlock({
  onClickDeleteIcon,
  onClickEditIcon,
  onClickImageIcon,
  onClickPasswordIcon,
  onClickViewIcon,
  onClickDesignationIcon,
  onClickHistroyIcon,
  onClickRewardIcon,
  onClickPoinHistoryIcon,
  onClickPermissionIcon,
  onClickSiteVisitIcon,
  permissionData,
  onPressFollowUps,
}: tableActionProps) {
  let array = [
    onClickDeleteIcon,
    onClickEditIcon,
    onClickImageIcon,
    onClickPasswordIcon,
    onClickViewIcon,
    onClickDesignationIcon,
    onClickHistroyIcon,
    onClickRewardIcon,
    onClickPoinHistoryIcon,
    onClickPermissionIcon,
    onClickSiteVisitIcon,
    onPressFollowUps,
  ];

  if (array.every((data) => data === undefined)) {
    return <p>-</p>;
  }
  const userData = getUserData();

  return (
    <div className={classes.actionContainer}>
      {userData?.user_type !== 1 &&
      CheckAllvalues({
        view: permissionData?.["view"],
        change_Password: permissionData?.["change_Password"],
        edit: permissionData?.["edit"],
        gallery_image_menu:
          permissionData?.["gallery_crud_action"]?.["gallery_image_menu"] ||
          permissionData?.["gallery_image"]?.["gallery_image_menu"],
        change_designation: permissionData?.["change_designation"],
        order_history_menu:
          permissionData?.["order_history"]?.["order_history_menu"],
        change_status: permissionData?.["change_status"],
        delete: permissionData?.["delete"],
        point_history: permissionData?.["point_history"],
      }) ? (
        "-"
      ) : (
        <>
          {permissionData?.["view"] && onClickViewIcon ? (
            <CommonImageBox
              tooltipData="View"
              source={Images.VIEW_ICON}
              alt="View Icon"
              type="tableIcon"
              onClick={onClickViewIcon}
            />
          ) : (
            ""
          )}
          {permissionData?.["change_Password"] && onClickPasswordIcon ? (
            <CommonImageBox
              type="tableIcon"
              tooltipData="Change Password"
              source={Images.LOCK_ICON}
              alt="Change Password Icon"
              onClick={onClickPasswordIcon}
            />
          ) : (
            ""
          )}
          {permissionData?.["edit"] && onClickEditIcon ? (
            <CommonImageBox
              tooltipData="Edit"
              source={Images.EDIT_ICON}
              type="tableIcon"
              alt="Edit Icon"
              onClick={onClickEditIcon}
            />
          ) : (
            ""
          )}
          {(permissionData?.["gallery_crud_action"]?.["gallery_image_menu"] ||
            permissionData?.["gallery_image"]?.["gallery_image_menu"]) &&
          onClickImageIcon ? (
            <CommonImageBox
              tooltipData="Images"
              source={Images.GALERY_ICON}
              alt="Images Icon"
              type="tableIcon"
              onClick={onClickImageIcon}
            />
          ) : (
            ""
          )}
          {permissionData?.["change_designation"] && onClickDesignationIcon ? (
            <CommonImageBox
              tooltipData="Change Designation"
              source={Images.DESIGNATION_ICON}
              alt="Designation Icon"
              type="tableIcon"
              onClick={() => onClickDesignationIcon?.()}
            />
          ) : (
            ""
          )}

          {permissionData?.["order_history"]?.["order_history_menu"] &&
          onClickHistroyIcon ? (
            <CommonImageBox
              tooltipData="View Order History"
              source={Images.HISTORY_ICON}
              alt="History Icon"
              type="tableIcon"
              onClick={onClickHistroyIcon}
            />
          ) : (
            ""
          )}
          {permissionData?.["change_status"] && onClickRewardIcon ? (
            <CommonImageBox
              tooltipData="Reward Redemption"
              source={Images.POINTS_ICON}
              alt="Reward Icon"
              type="tableIcon"
              onClick={onClickRewardIcon}
            />
          ) : (
            ""
          )}
          {permissionData?.["delete"] && onClickDeleteIcon ? (
            <CommonImageBox
              tooltipData="Delete"
              source={Images.DELETE_ICON}
              alt="Delete Icon"
              type="tableIcon"
              onClick={onClickDeleteIcon}
            />
          ) : (
            ""
          )}
          {permissionData?.["point_history"] && onClickPoinHistoryIcon ? (
            <CommonImageBox
              tooltipData="Point History"
              source={Images.PointhistroyIcon}
              alt="point history Icon"
              type="tableIcon"
              onClick={onClickPoinHistoryIcon}
            />
          ) : (
            ""
          )}
          {onClickPermissionIcon ? (
            <CommonImageBox
              tooltipData="Access Permission"
              source={Images.PERMISSION_ICON}
              alt="Access Permission"
              type="permission"
              onClick={onClickPermissionIcon}
            />
          ) : (
            ""
          )}
          {permissionData?.["site_visit_view"] && onClickSiteVisitIcon ? (
            <CommonImageBox
              tooltipData="Site Visit"
              source={Images.SiteVisitIcon}
              alt="Site Visit"
              type="images"
              onClick={onClickSiteVisitIcon}
            />
          ) : (
            ""
          )}
          {permissionData?.["follow_up_view"] && onPressFollowUps ? (
            <CommonImageBox
              tooltipData="FollowUps"
              source={Images.FollowUpICon}
              alt="FollowUps"
              type="images"
              onClick={onPressFollowUps}
            />
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}
